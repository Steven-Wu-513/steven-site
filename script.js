// ========== 工具函数 ==========
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getUrlParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// ========== 渲染文章卡片 ==========
function renderPostCard(post) {
  return `
    <a href="post.html?slug=${post.slug}" class="post-card">
      <div class="post-card-date">${formatDate(post.date)}</div>
      <h3 class="post-card-title">${post.title}</h3>
      <p class="post-card-excerpt">${post.excerpt}</p>
      <div class="post-card-tags">
        ${post.tags.map(t => `<span class="tag">#${t}</span>`).join('')}
      </div>
    </a>
  `;
}

// ========== 首页最新文章 ==========
function renderRecentPosts() {
  const container = document.getElementById('recentPosts');
  if (!container) return;
  const recent = posts.slice(0, 3);
  container.innerHTML = recent.map(renderPostCard).join('');
}

// ========== 文章列表页 ==========
function renderPostList() {
  const container = document.getElementById('postList');
  if (!container) return;
  container.innerHTML = posts.map(renderPostCard).join('');
}

// ========== 文章详情页 ==========
function renderPostDetail() {
  const container = document.getElementById('postDetail');
  if (!container) return;

  const slug = getUrlParam('slug');
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    container.innerHTML = `
      <div class="post-article" style="text-align:center;padding:80px 0;">
        <h1>文章未找到</h1>
        <p style="color:var(--text-secondary);margin:16px 0;">抱歉，您查找的文章不存在。</p>
        <a href="blog.html" class="btn-primary">返回文章列表</a>
      </div>
    `;
    return;
  }

  document.title = `${post.title} — Steven`;

  container.innerHTML = `
    <article class="post-article">
      <a href="blog.html" class="post-back">← 返回文章列表</a>
      <header class="post-article-header">
        <h1>${post.title}</h1>
        <div class="post-article-meta">
          <span>${formatDate(post.date)}</span>
          <span>·</span>
          <span>Steven</span>
        </div>
        <div class="post-article-tags">
          ${post.tags.map(t => `<span class="tag">#${t}</span>`).join('')}
        </div>
      </header>
      <div class="post-article-body">${post.content}</div>
    </article>
  `;
}

// ========== 导航高亮（单页滚动） ==========
function updateActiveNav() {
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.site-nav a');

  let currentId = '';
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 120) {
      currentId = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentId}`) {
      link.classList.add('active');
    }
  });

  // 如果滚到顶部，高亮首页
  if (window.scrollY < 100) {
    navLinks.forEach(link => link.classList.remove('active'));
    const homeLink = document.querySelector('.site-nav a[href="#home"]');
    if (homeLink) homeLink.classList.add('active');
  }
}

// ========== 移动端菜单 ==========
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('siteNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
    });
  });
}

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
  renderRecentPosts();
  renderPostList();
  renderPostDetail();
  initMobileMenu();

  // 滚动监听
  if (document.querySelector('.section[id]')) {
    window.addEventListener('scroll', updateActiveNav);
  }
});
