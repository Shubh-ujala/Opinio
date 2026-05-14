import { Router } from "express";
import {Poll} from "../models/poll.js";
import {Response} from "../models/response.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// this should be authenticated
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, isAnonymous, expiresAt, questions } = req.body;

    if (!title || !expiresAt || !questions?.length) {
      return res.status(400).json({
        error: {
          message: "Tile, expiry and atleast 1 question is required",
        },
      });
    }

    if (new Date(expiresAt) <= new Date()) {
      return res.status(400).json({
        error: {
          message: "Expiry must be of future",
        },
      });
    }
    // since the questions is of array type
    for (const q of questions) {
      if (!q.text) {
        return res.status(400).json({
          error: {
            message: "Each question must have some text",
          },
        });
      }

      if (!q.options || q.options.length < 2) {
        return res.status(400).json({
          error: {
            message: `Question ${q.text} should have atleast 2 options`,
          },
        });
      }
    }

    const poll = await Poll.create({
      creatorId: req.user.id,
      title,
      description,
      isAnonymous,
      expiresAt,
      questions,
    });

    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({
      err: {
        message: error.message,
      },
    });
  }
});

// this should be authenticated
router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const polls = await Poll.find({ creatorId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    // Attach response count to each poll
    const pollWithCount = await Promise.all(
      polls.map(async (poll) => {
        const responseCount = await Response.countDocuments({ pollId: poll._id });
        return { ...poll, responseCount };
      })
    );

    return res.status(201).json(pollWithCount);
  } catch (error) {
    res.status(500).json({
      err: {
        message: error.message,
      },
    });
  }
});

// this should not be authenticated since it is for public view
router.get("/:id", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(400).json({
        error: {
          message: "No poll found!",
        },
      });
    }

    if (poll.status == "active" && new Date(poll.expiresAt) < new Date()) {
      poll.status = "closed";
      await poll.save();
    }

    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({
      err: {
        message: error.message,
      },
    });
  }
});

router.post("/:id/publish", authMiddleware, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({
        error: {
          message: "No poll found!",
        },
      });
    }

    if (poll.creatorId.toString() !== req.user.id) {
      return res.status(403).json({
        error: {
          message: "Not your poll",
        },
      });
    }

    ((poll.isPublished = true), (poll.status = "closed"));
    await poll.save();

    //notify all the user via socket about the poll publishment

    res.status(201).json({
      message: "Poll published successfully",
      poll,
    });
  } catch (error) {
    res.status(500).json({
      err: {
        message: error.message,
      },
    });
  }
});

router.get("/:id/analytics", authMiddleware, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).lean();
    if (!poll) {
      return res.status(404).json({
        error: {
          message: "No poll found!",
        },
      });
    }
    if (poll.creatorId.toString() !== req.user.id) {
      return res.status(403).json({
        error: {
          message: "Not your poll",
        },
      });
    }

    const totalResponses = await Response.countDocuments({ pollId: poll._id });

    const voteCounts = await Response.aggregate([
      { $match: { pollId: poll._id } },
      { $unwind: "$answers" },
      { $group: { _id: "$answers.optionId", count: { $sum: 1 } } },
    ]);

    // Map counts into poll questions
    const voteMap = {};
    voteCounts.forEach((v) => {
      voteMap[v._id.toString()] = v.count;
    });

    const questions = poll.questions.map((q) => ({
      _id: q._id,
      text: q.text,
      isRequired: q.isRequired,
      options: q.options.map((o) => ({
        _id: o._id,
        text: o.text,
        count: voteMap[o._id.toString()] || 0,
      })),
    }));

    res.json({ totalResponses, questions, poll });
  } catch (error) {
    res.status(500).json({
      err: {
        message: error.message,
      },
    });
  }
});

router.get("/:id/results", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).lean();
    if (!poll) {
      return res.status(404).json({
        error: {
          message: "No poll found!",
        },
      });
    }

    if (!poll.isPublished) {
      return res.status(404).json({
        error: {
          message: "Results not published yet.",
        },
      });
    }

    const totalResponses = await Response.countDocuments({ pollId: poll._id });
    const voteCounts = await Response.aggregate([
      { $match: { pollId: poll._id } },
      { $unwind: "$answers" },
      { $group: { _id: "$answers.optionId", count: { $sum: 1 } } },
    ]);

    const voteMap = {};
    voteCounts.forEach((v) => {
      voteMap[v._id.toString()] = v.count;
    });

    const questions = poll.questions.map((q) => ({
      _id: q._id,
      text: q.text,
      options: q.options.map((o) => ({
        _id: o._id,
        text: o.text,
        count: voteMap[o._id.toString()] || 0,
      })),
    }));
    res.json({
      totalResponses,
      questions,
      title: poll.title,
      description: poll.description,
    });
  } catch (error) {
    res.status(500).json({
      err: {
        message: error.message,
      },
    });
  }
});


export default router