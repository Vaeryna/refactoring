import {describe, expect, it} from "vitest";

import {run as legacyReport} from "../legacy/legacy/orderReportLegacy.ts";
import {generateOrderReport as refactoredReport} from "../src/main.ts";


describe("Golden Master", () => {
    it("should generate the same report as legacy implementation", () => {

        const legacy = legacyReport();
        const refactored = refactoredReport();

        expect(refactored).toEqual(legacy);
    });
});