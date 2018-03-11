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
            // fill in your schema
        ]
    },

    create: function(context) {

        const reported = [];
        const ALLOWED_PARENT_TYPES = new Set(["CallExpression", "NewExpression"]);

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
                        && (effectiveParent.type === "AssignmentExpression"
                                && (effectiveParent.right.type !== "MemberExpression"
                                || effectiveParent.left.type === "MemberExpression"
                                && effectiveParent.left.property.name === node.name)
                        )
                    )
                    || (node.parent.type === "Property"
                        && !ALLOWED_PARENT_TYPES.has(effectiveParent.type)
                        && !(node.parent.parent && node.parent.parent.type === "ObjectPattern"
                            && node.parent.key === node && node.parent.value !== node
                        ) 
                    )
                    || !ALLOWED_PARENT_TYPES.has(effectiveParent.type)
                )
                {
                    // time for some exclusions...
                    if(["ImportSpecifier", "ImportNamespaceSpecifier", "ImportDefaultSpecifier"].indexOf(node.parent.type) >= 0
                            && node.parent.local && node.parent.local.name === node.name)
                        return;

                        if(name === "Materialize") console.log(node)
                    let camel = isFunction(node) || node.parent.type === "ClassDeclaration";

                    if(camel && isUnderscored(name) || !camel && !isSnake(name)) report(node, camel ? "camel" : "snake");
                }
                return;
            }
        };
    }
};
