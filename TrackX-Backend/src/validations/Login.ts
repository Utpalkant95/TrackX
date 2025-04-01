import z from "zod";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().nonempty(),
});

export default loginSchema;