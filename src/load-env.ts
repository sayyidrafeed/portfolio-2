import { resolve } from "node:path";

import { config } from "dotenv";

config({ path: resolve(".env.local"), quiet: true });
config({ path: resolve(".env"), quiet: true });
