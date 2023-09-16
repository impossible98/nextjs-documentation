// import third-party modules
import { defineConfig } from 'vitepress';
// import local modules
import { sidebarGuide } from './guide';

export default defineConfig({
  description: 'The React Framework for the Web',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  lang: 'en-US',
  lastUpdated: true,
  themeConfig: {
    nav: nav(),
    outline: [2, 3],
    sidebar: {
      '/guide/': sidebarGuide(),
    },
    footer: {
      copyright: `Copyright © 2020-${new Date().getFullYear()} My Project, Inc. Built with VitePress`,
    },
  },
  title: 'Next.js',
});
function nav() {
  return [
    {
      activeMatch: '/guide/',
      link: '/guide/intro',
      text: 'Guide',
    },
  ];
}
