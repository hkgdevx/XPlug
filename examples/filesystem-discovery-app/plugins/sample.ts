/**
 * @file sample.ts
 * @author Harikrishnan Gangadharan
 * @copyright 2026 Harikrishnan Gangadharan. All rights reserved.
 * @description XPlug Plugin Architecture component.
 */

export default {
  name: 'sample-filesystem-feature',
  version: '1.0.0',
  hooks: {
    'onBoot': () => {
       console.log("Dynamically loaded from FileSystem!");
    }
  }
};
