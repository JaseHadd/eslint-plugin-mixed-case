/**
 * @fileoverview Plugin to support mixed case
 * @author Jason Frost
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/mixed-case"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("mixed-case", rule, {

    valid: [

        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "let camelCase = ''",
            errors: [{
                message: "Fill me in.",
                type: "Me too"
            }]
        }
    ]
});
