

import app from './app.js';
import { DEFAULT_PORT } from './lib/constants.js';

const PORT = process.env.PORT ?? DEFAULT_PORT;
app.listen(PORT, console.log(`Server running on http://localhost:${PORT}`));