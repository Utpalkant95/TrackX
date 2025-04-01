import { Response } from "express";
import { User, Workout } from "../models";
import { AuthRequest, IWorkoutSchema } from "../interfaces/Project";
import puppeteer from "puppeteer";
import fs from "fs-extra";
import path from "path";

export const personalBest = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userID = req.id;
    const user = await User.findById(userID);
    const weightPreference = user?.preferences;

    // Fetch all workouts of the user
    const workouts: IWorkoutSchema[] = await Workout.find({ userId: userID });

    if (!workouts.length) {
      res.status(404).json({ success: false, message: "No workouts found" });
      return;
    }

    let heaviestWeight = 0;
    let maxReps = 0;
    let exerciseCount: Record<string, number> = {};
    let workoutDays = new Set<string>();

    // Extract Heaviest Weight & Max Reps
    const workoutDates = new Set<string>();
    workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        exercise.sets.forEach((set) => {
          if (set.weight > heaviestWeight) heaviestWeight = set.weight;
          if (set.reps > maxReps) maxReps = set.reps;
        });
      });
      workoutDates.add(new Date(workout.date).toISOString().split("T")[0]);
    });

    workouts.forEach((workout) => {
      const workoutDate = new Date(workout.date).toISOString().split("T")[0];
      workoutDays.add(workoutDate);

      workout.exercises.forEach((exercise) => {
        exerciseCount[exercise.name] = (exerciseCount[exercise.name] || 0) + 1;
      });
    });

    // Calculate workout streak
    let sortedWorkoutDays = Array.from(workoutDays).sort();
    let streak = 0;
    let currentDate = new Date().toISOString().split("T")[0];

    for (let i = sortedWorkoutDays.length - 1; i >= 0; i--) {
      if (sortedWorkoutDays[i] === currentDate) {
        streak++;
        currentDate = new Date(
          new Date(currentDate).setDate(new Date(currentDate).getDate() - 1)
        )
          .toISOString()
          .split("T")[0];
      } else {
        break;
      }
    }

    const heaviestWeightValue =
      weightPreference === "lbs"
        ? `${(heaviestWeight * 2.20462).toFixed(2)} lbs`
        : `${heaviestWeight} kg`;

    const data = [
      { title: "Heaviest Weight Lifted", value: heaviestWeightValue },
      { title: "Max Reps in Single Set", value: maxReps },
      { title: "Longest Workout Streak", value: `${streak} days` },
    ];

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching personal bests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const aiInsights = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.id;
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    // Get last 2 weeks of workout history
    const workouts = await Workout.find({ userId }).sort({ date: -1 });

    if (!workouts.length) {
      res.json({
        success: true,
        data: [
          {
            type: "info",
            message: "Start logging your workouts to get AI insights.",
          },
        ],
      });
      return;
    }

    let plateauDetected = null;
    let workoutSuggestion = null;
    let recoveryAlert = null;

    // **Plateau Detection** (same weight & reps for 2 weeks)
    const exerciseMap = new Map();
    workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        const key = exercise.name;
        if (!exerciseMap.has(key)) {
          exerciseMap.set(key, []);
        }
        exerciseMap.get(key).push(exercise.sets);
      });
    });

    for (let [exerciseName, setsArray] of exerciseMap.entries()) {
      if (setsArray.length >= 2) {
        let recentSets = setsArray[0];
        let oldSets = setsArray[setsArray.length - 1];

        if (
          JSON.stringify(recentSets) === JSON.stringify(oldSets) &&
          new Date(workouts[workouts.length - 1].date) <= twoWeeksAgo
        ) {
          plateauDetected = {
            type: "plateauDetected",
            exercise: exerciseName,
            message: `No progress detected in ${exerciseName} for 2 weeks. Consider adjusting sets or weight.`,
          };
          break;
        }
      }
    }

    // **Workout Suggestion** (Increase weight if stuck)
    if (!plateauDetected && workouts.length >= 3) {
      let recentWorkout = workouts[0];
      recentWorkout.exercises.forEach((exercise) => {
        let firstSet = exercise.sets[0];
        if (firstSet.weight < 100) {
          workoutSuggestion = {
            type: "workoutSuggestion",
            message: `Try increasing weight by 2.5kg next session for progressive overload.`,
          };
        }
      });
    }

    // **Recovery Alert** (Detect 6+ consecutive workout days)
    let streakCount = 1;
    for (let i = 0; i < workouts.length - 1; i++) {
      let currDate: any = new Date(workouts[i].date);
      let prevDate: any = new Date(workouts[i + 1].date);

      let diff = (currDate - prevDate) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streakCount++;
      } else {
        break;
      }
    }

    if (streakCount >= 6) {
      recoveryAlert = {
        type: "recoveryAlert",
        message: `You've worked out ${streakCount} days in a row. Consider a rest day for optimal muscle recovery.`,
      };
    }

    // **Final Response Array**
    const insights = [];

    if (plateauDetected) insights.push(plateauDetected);
    if (workoutSuggestion) insights.push(workoutSuggestion);
    if (recoveryAlert) insights.push(recoveryAlert);

    // **If no insights are generated, show default message**
    if (insights.length === 0) {
      insights.push({
        type: "info",
        message: "Keep tracking your workouts to receive AI insights.",
      });
    }

    res.status(200).json({
      success: true,
      data: insights,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error while generating AI insights",
    });
  }
};

export const weeklyProgress = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.id;
    const today = new Date();
    const sevenDaysAgo = new Date();
    const fourteenDaysAgo = new Date();

    sevenDaysAgo.setDate(today.getDate() - 7);
    fourteenDaysAgo.setDate(today.getDate() - 14);

    // Get workouts from last two weeks
    const lastWeekWorkouts = await Workout.find({
      userId,
      date: { $gte: sevenDaysAgo, $lt: today },
    });

    const prevWeekWorkouts = await Workout.find({
      userId,
      date: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo },
    });

    if (!lastWeekWorkouts.length || !prevWeekWorkouts.length) {
      res.json({
        success: true,
        data: {
          weightProgress: "Not enough data to compare weekly progress.",
          repsProgress: "Track workouts for accurate progress updates.",
        },
      });
      return;
    }

    // **Calculate Total Weight Lifted**
    const calcTotalWeight = (workouts: IWorkoutSchema[]) => {
      return workouts.reduce((total, workout) => {
        return (
          total +
          workout.exercises.reduce((exerciseTotal, exercise) => {
            return (
              exerciseTotal +
              exercise.sets.reduce(
                (setTotal, set) => setTotal + set.weight * set.reps,
                0
              )
            );
          }, 0)
        );
      }, 0);
    };

    const lastWeekWeight = calcTotalWeight(lastWeekWorkouts);
    const prevWeekWeight = calcTotalWeight(prevWeekWorkouts);

    let weightProgress = "No change in weight lifted.";
    if (prevWeekWeight > 0) {
      const weightDiff =
        ((lastWeekWeight - prevWeekWeight) / prevWeekWeight) * 100;
      weightProgress =
        weightDiff > 0
          ? `You lifted ${weightDiff.toFixed(
              1
            )}% more weight this week compared to last.`
          : `You lifted ${Math.abs(
              Number(weightDiff.toFixed(1))
            )}% less weight this week compared to last.`;
    }

    // **Calculate Average Reps per Exercise**
    const calcAvgReps = (workouts: IWorkoutSchema[]) => {
      let totalReps = 0;
      let exerciseCount = 0;

      workouts.forEach((workout) => {
        workout.exercises.forEach((exercise) => {
          exercise.sets.forEach((set) => {
            totalReps += set.reps;
          });
          exerciseCount++;
        });
      });

      return exerciseCount > 0 ? totalReps / exerciseCount : 0;
    };

    const lastWeekReps = calcAvgReps(lastWeekWorkouts);
    const prevWeekReps = calcAvgReps(prevWeekWorkouts);

    let repsProgress = "No change in reps.";
    if (prevWeekReps > 0) {
      const repsDiff = lastWeekReps - prevWeekReps;
      repsProgress =
        repsDiff > 0
          ? `Reps increased by ${repsDiff.toFixed(
              1
            )} on average in the last 7 days.`
          : `Reps decreased by ${Math.abs(
              Number(repsDiff.toFixed(1))
            )} on average in the last 7 days.`;
    }

    // **Final Response**
    res.status(200).json({
      success: true,
      data: {
        weightProgress,
        repsProgress,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error while calculating weekly progress",
    });
  }
};

export const progressGraph = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.id;
    const { exerciseName, dateRange } = req.params;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(dateRange));

    function formatDate(isoDate: any) {
      const date = new Date(isoDate);
      return date
        .toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
        .replace(" ", " ");
    }

    // Fetch workouts with exercises filtered for "Barbell Bend Over Row"
    const workouts: IWorkoutSchema[] = await Workout.find({
      userId,
      exercises: { $elemMatch: { name: exerciseName } },
      date: { $gte: startDate },
    }).sort({ date: -1 });

    const lastSetData = workouts
      .map((workout) => {
        const exercise = workout.exercises.find(
          (ex) => ex.name === exerciseName
        );
        if (exercise) {
          const lastSet = exercise.sets[exercise.sets.length - 1];
          return {
            date: formatDate(workout.date),
            weight: lastSet.weight,
            reps: lastSet.reps,
          };
        }
        return null;
      })
      .filter((data) => data !== null);

    res.status(200).json({ success: true, data: lastSetData });
  } catch (error) {
    console.log("error while getting progress graph", error);
    res.status(500).json({
      success: false,
      message: "server error while getting progress graph",
    });
  }
};

export const progressReport = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.id;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // Last 7 days

    // Fetch user's workout data for the last week
    const workouts = await Workout.find({
      userId,
      date: { $gte: startDate },
    }).sort({ date: -1 });

    if (!workouts.length) {
      res.status(404).json({
        success: false,
        message: "No workout data found for the report.",
      });
      return;
    }

    let reportContent = `
      <html>
      <head>
        <title>Workout Progress Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>Workout Progress Report</h1>
        <p><strong>User ID:</strong> ${userId}</p>
        <p><strong>Report Date:</strong> ${new Date().toLocaleDateString()}</p>
        
        <h2>Workout Summary</h2>
        <table>
          <tr>
            <th>Date</th>
            <th>Exercise</th>
            <th>Sets</th>
            <th>Reps</th>
            <th>Weight</th>
          </tr>`;

    // Append workout data to the report
    workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        exercise.sets.forEach((set) => {
          reportContent += `
            <tr>
              <td>${new Date(workout.date).toLocaleDateString()}</td>
              <td>${exercise.name}</td>
              <td>${exercise.sets.length}</td>
              <td>${set.reps}</td>
              <td>${set.weight} kg</td>
            </tr>`;
        });
      });
    });

    reportContent += `
        </table>
        <h2>AI Insights</h2>
        <p><i>Keep up the progress! Increase weights progressively and ensure proper recovery.</i></p>
      </body>
      </html>`;

    // Launch Puppeteer to convert HTML to PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(reportContent);
    const pdfPath = path.join(
      __dirname,
      `../../reports/workout_report_${userId}.pdf`
    );
    await page.pdf({ path: pdfPath, format: "A4" });
    await browser.close();

    // Send the generated PDF as a response
    res.download(pdfPath, "Workout_Progress_Report.pdf", async (err) => {
      if (err) console.error("Error sending report:", err);
      await fs.remove(pdfPath); // Delete the file after sending
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res
      .status(500)
      .json({ success: false, message: "Error generating report." });
  }
};

export const exerciseList = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.id;

    const workout = await Workout.find({ userId });

    const exerciseList = workout.flatMap((workout) => {
      return workout.exercises.map((exercise) => exercise.name);
    });

    const exerciseSet = new Set(exerciseList);
    const uniqueExercises = Array.from(exerciseSet);
    res.status(200).json({ success: true, data: uniqueExercises });
  } catch (error) {
    console.log("error in listing exercise", error);
    res.status(500).json({
      success: false,
      message: "server error while listing exercise",
    });
  }
};
