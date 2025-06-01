import { env } from "@env";
import Cors from "cors";

export const cors = Cors({ origin: env.SERVER_URL.origin });
