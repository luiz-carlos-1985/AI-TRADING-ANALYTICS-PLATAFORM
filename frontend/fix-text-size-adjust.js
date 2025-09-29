module.exports = () => {
  return {
    postcssPlugin: 'fix-text-size-adjust',
    Rule(rule) {
      rule.walkDecls('text-size-adjust', (decl) => {
        // Add -webkit- prefix before the standard property
        decl.cloneBefore({ prop: '-webkit-text-size-adjust' });
        decl.cloneBefore({ prop: '-moz-text-size-adjust' });
      });
      
      rule.walkDecls('-webkit-text-size-adjust', (decl) => {
        // Ensure standard property exists after webkit
        const hasStandard = rule.some(child => 
          child.prop === 'text-size-adjust'
        );
        if (!hasStandard) {
          decl.cloneAfter({ prop: 'text-size-adjust' });
        }
      });
    }
  }
}
module.exports.postcss = true