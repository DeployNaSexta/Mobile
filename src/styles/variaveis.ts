:root {
  /* Breakpoints (referência para uso em JS via useMediaQuery) */
  --breakpoint-mobile: 480px;
  --breakpoint-tablet: 768px;
  --breakpoint-desktop: 1024px;
  --breakpoint-wide: 1280px;

  /* Espaçamentos */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 40px;

  /* Cores base (substituir pela identidade visual do projeto real) */
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --color-primary: #2f6fed;
  --color-border: #e2e2e2;

  /* Container */
  --container-max-width: 1200px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  background: var(--color-bg);
  color: var(--color-text);
}

.container {
  width: 100%;
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}
