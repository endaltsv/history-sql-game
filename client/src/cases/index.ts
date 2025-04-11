import { Case } from "../types";
import kulikovoBattleCase from "./case-000";
import vanishingBriefcaseCase from "./case-001";
import theStolenSound from "./case-002";
import miamiMarinaMurderCase from "./case-003";
import midnightMasqueradeMurderCase from "./case-004";
import artBaselAssassinationCase from "./case-005";
import vanishingDiamondCase from "./case-006";

// Export all cases as a single array
export const allCases: Case[] = [
  kulikovoBattleCase,    // case-000
  vanishingBriefcaseCase, // case-001
  theStolenSound,        // case-002
  miamiMarinaMurderCase, // case-003
  midnightMasqueradeMurderCase, // case-004
  artBaselAssassinationCase,   // case-005
  vanishingDiamondCase,  // case-006
];

// Export individual cases for direct imports
export {
  kulikovoBattleCase,
  vanishingBriefcaseCase,
  theStolenSound,
  miamiMarinaMurderCase,
  midnightMasqueradeMurderCase,
  artBaselAssassinationCase,
  vanishingDiamondCase,
};
