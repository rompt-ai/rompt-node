#! /usr/bin/env node

import { pull } from './index';

pull()
    .then(() => {
        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
