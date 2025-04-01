import z from "zod";

const createWorkoutSchema = z.object({
  date: z.string().nonempty(), // ✅ Ensure date is a string before converting to Date
  exercises: z
    .array(
      z.object({
        name: z.string().nonempty(),
        bodyPart : z.string().nonempty(),
        equipment : z.string().nonempty(),
        sets: z
          .array(
            z.object({
              reps: z.number().int().positive(), // ✅ Ensure reps are positive integers
              weight: z.number().positive(), // ✅ Ensure weight is always positive
              difficulty: z.enum(["Easy", "Medium", "Hard"]), // ✅ Restrict difficulty to "Easy" or "Hard"
            })
          )
          .nonempty(), // ✅ Ensure at least one set is present
      })
    )
    .nonempty(), // ✅ Ensure at least one exercise is provided
});

export default createWorkoutSchema;
