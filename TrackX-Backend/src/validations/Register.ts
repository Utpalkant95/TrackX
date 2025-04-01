import z from "zod";

const registerSchema = z.object({
    name: z.string().nonempty(),
    email: z.string().email(),
    password: z.string().nonempty(),
});

export default registerSchema;