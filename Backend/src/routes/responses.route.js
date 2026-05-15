import { Router } from "express";
import {Response} from "../models/response.js";
import {Poll} from "../models/poll.js";
import { authMiddleware } from "../middleware/auth.js";
import { verifyToken } from "../utils/token.js";

const router = Router();

router.post("/:pollId", async (req, res) => {
  try {
    
    const poll = await Poll.findById(req.params.pollId);
    if (!poll) {
      return res.status(404).json({
        error: {
          message: "No poll found!",
        },
      });
    }
    if (new Date(poll.expiresAt) < new Date()) {
      return res.status(404).json({
        error: {
          message: "poll already expired!",
        },
      });
    }
    if (poll.status == "closed" || poll.isPublished) {
      return res.status(404).json({
        error: {
          message: "poll is no longer accepting response",
        },
      });
    }

    //check if the is accepting anonymouse responses or not
    let userId = null;
    if (!poll.isAnonymous) {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(400).json({
          error: {
            message: "Login required to submit response",
          },
        });
      }
      const decodedToken = verifyToken(token);
      userId = decodedToken.id;
    }

    const { answers } = req.body; // [{ questionId, optionId }]

    // Validate required questions
    const requiredQuestions = poll.questions
      .filter((q) => q.isRequired)
      .map((q) => q._id.toString());

    const answeredQuestions = (answers || []).map((a) => a.questionId);

    const missing = requiredQuestions.filter(
      (qId) => !answeredQuestions.includes(qId),
    );
    if (missing.length > 0)
      return res
        .status(400)
        .json({ error: "Please answer all required questions" });

    // Save response
    console.log('answers received:', JSON.stringify(answers, null, 2))
    const response = await Response.create({
      pollId: poll._id,
      userId,
      answers,
    });

    // Emit real-time update
    const io = req.app.get("io");
    if (io) {
      const responsesCount = await Response.countDocuments({ pollId: poll._id });
      io.to(`poll-${poll._id.toString()}`).emit("poll:update", { totalResponses: responsesCount });
    }
    
    res.status(201).json({ message: "Response submitted successfully", response });
  } catch (error) {
    res.status(500).json({
      err: {
        message: error.message,
      },
    });
  }
});

export default router
