/**
 * @fileoverview Plugin to support mixed case
 * @author Jason Frost
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "Plugin to support mixed case",
            category: "Fill me in",
            recommended: false
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            {
                type: "object",
                properties: {
                    properties: {
                        enum: ["always", "never"]
                    }
                },
                additionalProperties: false
            }
        ]
    },

    create: function(context) {

        const reported = [];
        const ALLOWED_PARENT_TYPES = new Set(["CallExpression", "NewExpression"]);
        const IMPORT_TYPES = new Set(["ImportSpecifier", "ImportNamespaceSpecifier", "ImportDefaultSpecifier"]);

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------


        function isUnderscored(name) {
            return name.indexOf("_") > -1 && name !== name.toUpperCase();
        }

        function isSnake(name) {
            return !/[A-Z]/.test(name);
            return name.indexOf("_") > -1 && name === name.toLowerCase();
        }

        function isFunction(node) {
            if(node === undefined) return false;

            const isFunctionDefinition = node.parent.type === "MethodDefinition" || node.parent.type === "FunctionDeclaration"
            const isArrowFunction = node.parent.init && node.parent.init.type == "ArrowFunctionExpression";
            const isFunctionProperty = node.parent.type === "Property" && node.parent.value.type === "FunctionExpression";
            
            return isFunctionDefinition || isArrowFunction || isFunctionProperty;
        }
        
        function report(node, caseName) {
            if (reported.indexOf(node) < 0)
                reported.push(node);
                context.report({ node, message: "Identifier '{{name}}' is not in {{case}} case.", data: { name: node.name, case: caseName } })
        }
        
        const options = context.options[0] || {};
        let properties = options.properties || "";

        if (properties !== "always" && properties !== "never") {
            properties = "always";
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            Identifier(node) {
                const name = node.name.replace(/^_+|_+$/g, ""),
                    effectiveParent = (node.parent.type === "MemberExpression") ? node.parent.parent : node.parent,
                    snake = isSnake(name);
                const skip = snake && !isFunction(node);

                if (
                    (node.parent.type === "MemberExpression"
                        && properties !== "never"
                        && (effectiveParent.type === "AssignmentExpression"
                                && (effectiveParent.right.type !== "MemberExpression"
                                    || effectiveParent.left.type === "MemberExpression"
                                    && effectiveParent.left.property.name === node.name)
                        )
                    )
                    || (node.parent.type === "Property"
                        && properties !== "never"
                        && !ALLOWED_PARENT_TYPES.has(effectiveParent.type)
                        && !(node.parent.parent && node.parent.parent.type === "ObjectPattern"
                            && node.parent.key === node && node.parent.value !== node
                        ) 
                    )
                    || !ALLOWED_PARENT_TYPES.has(effectiveParent.type)
                )
                {
                    // time for some exclusions...
                    if(IMPORT_TYPES.has(node.parent.type)
                            && node.parent.local && node.parent.local.name === node.name)
                        return;
                    // Gets things like === and instanceof 
                    if(node.parent.type === "BinaryExpression") return;

                    // Get assignments where we're the value
                    if(node.parent.type === "AssignmentExpression" && node.parent.right == node) return;

                    let camel = isFunction(node) || node.parent.type === "ClassDeclaration";

                    if(camel && isUnderscored(name) || !camel && !isSnake(name)) report(node, camel ? "camel" : "snake");
                }
                return;
            }
        };
    }
};
