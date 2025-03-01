import React, { useState } from 'react';
import { BlogPostDoc, UserDoc } from '../../types';
import {
  Heart,
  MessageSquare,
  Plus,
  Trash2,
  Edit3,
  User,
  ExternalLink,
  Code,
  Image as ImageIcon,
  Check,
  X,
  Sparkles,
} from 'lucide-react';

interface BlogAppProps {
  posts: BlogPostDoc[];
  users: UserDoc[];
  currentUser: UserDoc;
  onSavePost: (post: BlogPostDoc) => void;
  onDeletePost: (postId: string) => void;
  onToggleLike: (postId: string, userId: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onUpdateUser: (user: UserDoc) => void;
}

export const BlogApp: React.FC<BlogAppProps> = ({
  posts,
  users,
  currentUser,
  onSavePost,
  onDeletePost,
  onToggleLike,
  onAddComment,
  onUpdateUser,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'mine' | 'create'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePost, setActivePost] = useState<BlogPostDoc | null>(null);
  const [inspectDoc, setInspectDoc] = useState<BlogPostDoc | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPostDoc | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');

  // Form states for creating/editing
  const [formData, setFormData] = useState<{
    title: string;
    excerpt: string;
    content: string;
    category: 'Backend' | 'Node.js' | 'Express' | 'MongoDB' | 'Architecture';
    coverImage: string;
  }>({
    title: '',
    excerpt: '',
    content: '',
    category: 'Backend',
    coverImage: '/src/assets/images/blog_cover_tech_1791193167640.jpg',
  });

  // Profile modal state
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileBio, setProfileBio] = useState(currentUser.bio || '');
  const [profileAvatar, setProfileAvatar] = useState(currentUser.avatarUrl || '');

  const filteredPosts = posts.filter((p) => {
    if (filterMode === 'mine' && p.authorId !== currentUser._id) return false;
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    return true;
  });

  const handleStartCreate = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: 'Backend',
      coverImage: '/src/assets/images/blog_cover_tech_1791193167640.jpg',
    });
    setFilterMode('create');
  };

  const handleStartEdit = (post: BlogPostDoc) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      coverImage: post.coverImage || '/src/assets/images/blog_cover_tech_1791193167640.jpg',
    });
    setFilterMode('create');
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    if (editingPost) {
      const updated: BlogPostDoc = {
        ...editingPost,
        title: formData.title,
        slug,
        excerpt: formData.excerpt || formData.content.slice(0, 140) + '...',
        content: formData.content,
        category: formData.category,
        coverImage: formData.coverImage,
        updatedAt: new Date().toISOString(),
        __v: editingPost.__v + 1,
      };
      onSavePost(updated);
    } else {
      const newPost: BlogPostDoc = {
        _id: '6541' + Math.random().toString(16).substring(2, 10) + 'a10393',
        title: formData.title,
        slug,
        excerpt: formData.excerpt || formData.content.slice(0, 140) + '...',
        content: formData.content,
        category: formData.category,
        authorId: currentUser._id,
        authorName: currentUser.name,
        authorUsername: currentUser.username,
        authorAvatar: currentUser.avatarUrl,
        coverImage: formData.coverImage,
        likes: [],
        comments: [],
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
      };
      onSavePost(newPost);
    }

    setFilterMode('all');
    setEditingPost(null);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...currentUser,
      name: profileName,
      bio: profileBio,
      avatarUrl: profileAvatar,
      updatedAt: new Date().toISOString(),
    });
    setShowProfileModal(false);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePost || !newCommentText.trim()) return;
    onAddComment(activePost._id, newCommentText.trim());
    setNewCommentText('');
    // refresh activePost view
    const updated = posts.find((p) => p._id === activePost._id);
    if (updated) setActivePost(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Project 1</span>
            <span aria-hidden="true">·</span>
            <span>Express.js & EJS Architecture</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-emerald-400">MongoDB / posts</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white mt-1">
            Blog Post Management Engine
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mt-0.5">
            Full-stack publication system with user authentication, post CRUD, author profiles, and real-time MongoDB document sync.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              setProfileName(currentUser.name);
              setProfileBio(currentUser.bio || '');
              setProfileAvatar(currentUser.avatarUrl || '');
              setShowProfileModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors"
          >
            <User className="h-3.5 w-3.5 text-slate-400" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={handleStartCreate}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Post</span>
          </button>
        </div>
      </div>

      {/* Filter / Subnav */}
      {filterMode !== 'create' && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/50 p-2 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800/60">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filterMode === 'all'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Articles ({posts.length})
            </button>
            <button
              onClick={() => setFilterMode('mine')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filterMode === 'mine'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              My Posts ({posts.filter((p) => p.authorId === currentUser._id).length})
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 hidden sm:inline">Category:</span>
            {['all', 'Backend', 'Node.js', 'Express', 'MongoDB'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Create / Edit Form */}
      {filterMode === 'create' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">
                {editingPost ? 'Edit Blog Post' : 'Compose New Article'}
              </h3>
              <p className="text-xs text-slate-400">
                Author: <span className="text-slate-200 font-medium">{currentUser.name}</span> (@{currentUser.username})
              </p>
            </div>
            <button
              onClick={() => {
                setFilterMode('all');
                setEditingPost(null);
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmitPost} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Article Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Node.js Event Loop & Express Middleware"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as any,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Backend">Backend</option>
                  <option value="Node.js">Node.js</option>
                  <option value="Express">Express</option>
                  <option value="MongoDB">MongoDB</option>
                  <option value="Architecture">Architecture</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Brief Summary (Excerpt)</label>
              <input
                type="text"
                placeholder="A concise one-line summary of this post..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Cover Image URL / Preset</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Image path or URL"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      coverImage: '/src/assets/images/blog_cover_arch_1791193180159.jpg',
                    })
                  }
                  className="px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg whitespace-nowrap"
                >
                  Use Arch Cover
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      coverImage: '/src/assets/images/blog_cover_tech_1791193167640.jpg',
                    })
                  }
                  className="px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg whitespace-nowrap"
                >
                  Use Tech Cover
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Article Content (Markdown / Text)</label>
              <textarea
                required
                rows={7}
                placeholder="Write your guide, code examples, and technical notes..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setFilterMode('all');
                  setEditingPost(null);
                }}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
              >
                {editingPost ? 'Save Changes' : 'Publish to MongoDB'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Post Grid View */}
      {filterMode !== 'create' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map((post) => {
            const hasLiked = post.likes.includes(currentUser._id);
            const isOwner = post.authorId === currentUser._id;

            return (
              <div
                key={post._id}
                className="group relative flex flex-col justify-between bg-slate-900/60 rounded-xl border border-slate-800/90 overflow-hidden hover:border-slate-700/80 transition-all duration-200"
              >
                {/* Cover Image */}
                {post.coverImage && (
                  <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback container if image fails
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-950/80 text-emerald-400 border border-emerald-500/20 backdrop-blur-xs">
                        {post.category}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    {/* Metadata line without pills */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span>{post.authorName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3
                      onClick={() => setActivePost(post)}
                      className="font-semibold text-slate-100 hover:text-emerald-400 cursor-pointer transition-colors line-clamp-2"
                    >
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Actions footer */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onToggleLike(post._id, currentUser._id)}
                        className={`flex items-center gap-1 transition-colors ${
                          hasLiked ? 'text-rose-400' : 'hover:text-slate-200'
                        }`}
                        title={hasLiked ? 'Unlike' : 'Like'}
                      >
                        <Heart
                          className={`h-3.5 w-3.5 ${hasLiked ? 'fill-rose-400' : ''}`}
                        />
                        <span className="tabular-nums">{post.likes.length}</span>
                      </button>

                      <button
                        onClick={() => setActivePost(post)}
                        className="flex items-center gap-1 hover:text-slate-200 transition-colors"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span className="tabular-nums">{post.comments.length}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setInspectDoc(post)}
                        className="p-1 text-slate-400 hover:text-emerald-400 rounded hover:bg-slate-800/60"
                        title="View MongoDB Document"
                      >
                        <Code className="h-3.5 w-3.5" />
                      </button>

                      {isOwner && (
                        <>
                          <button
                            onClick={() => handleStartEdit(post)}
                            className="p-1 text-slate-400 hover:text-sky-400 rounded hover:bg-slate-800/60"
                            title="Edit Post"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onDeletePost(post._id)}
                            className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800/60"
                            title="Delete Post"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Active Post Modal (Read & Comment) */}
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <span>{activePost.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activePost.authorName}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">
                    {new Date(activePost.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">{activePost.title}</h2>
              </div>
              <button
                onClick={() => setActivePost(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {activePost.coverImage && (
              <img
                src={activePost.coverImage}
                alt={activePost.title}
                referrerPolicy="no-referrer"
                className="w-full h-56 object-cover rounded-xl border border-slate-800"
              />
            )}

            <div className="prose prose-invert max-w-none text-slate-300 text-sm whitespace-pre-line leading-relaxed">
              {activePost.content}
            </div>

            {/* Like and Mongo Inspect */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
              <button
                onClick={() => onToggleLike(activePost._id, currentUser._id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
                  activePost.likes.includes(currentUser._id)
                    ? 'border-rose-500/40 text-rose-300 bg-rose-500/10'
                    : 'border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${
                    activePost.likes.includes(currentUser._id) ? 'fill-rose-400' : ''
                  }`}
                />
                <span>{activePost.likes.length} Likes</span>
              </button>

              <button
                onClick={() => setInspectDoc(activePost)}
                className="flex items-center gap-1 text-slate-400 hover:text-emerald-400"
              >
                <Code className="h-4 w-4" />
                <span>Inspect BSON Record</span>
              </button>
            </div>

            {/* Comments Section */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <h4 className="text-xs font-semibold text-slate-200">
                Discussion ({activePost.comments.length})
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {activePost.comments.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No comments yet. Start the conversation!</p>
                ) : (
                  activePost.comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="font-semibold text-slate-300">
                          {comment.username}
                        </span>
                        <span className="tabular-nums text-[11px]">
                          {new Date(comment.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-slate-300">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSendComment} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add your reply as authenticated user..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold bg-emerald-400 text-slate-950 hover:bg-emerald-300 rounded-lg transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Raw MongoDB Document Inspector Modal */}
      {inspectDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl max-w-xl w-full p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-emerald-400" />
                <span className="font-mono text-xs font-semibold text-white">
                  MongoDB Document (db.posts.findOne)
                </span>
              </div>
              <button
                onClick={() => setInspectDoc(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <pre className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-xs font-mono text-emerald-300 max-h-80 overflow-y-auto">
              {JSON.stringify(
                {
                  _id: `ObjectId("${inspectDoc._id}")`,
                  title: inspectDoc.title,
                  slug: inspectDoc.slug,
                  author: {
                    _id: `ObjectId("${inspectDoc.authorId}")`,
                    name: inspectDoc.authorName,
                    username: inspectDoc.authorUsername,
                  },
                  category: inspectDoc.category,
                  likesCount: inspectDoc.likes.length,
                  likes: inspectDoc.likes.map((id) => `ObjectId("${id}")`),
                  commentsCount: inspectDoc.comments.length,
                  published: inspectDoc.published,
                  createdAt: inspectDoc.createdAt,
                  updatedAt: inspectDoc.updatedAt,
                  __v: inspectDoc.__v,
                },
                null,
                2
              )}
            </pre>

            <div className="flex justify-end">
              <button
                onClick={() => setInspectDoc(null)}
                className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Enhancement Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                Profile Enhancement
              </h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Bio</label>
                <textarea
                  rows={2}
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Avatar Image Path / Preset</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={profileAvatar}
                    onChange={(e) => setProfileAvatar(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setProfileAvatar(
                        '/src/assets/images/avatar_developer_1791193190767.jpg'
                      )
                    }
                    className="px-2.5 py-1 text-xs bg-slate-800 text-slate-300 rounded hover:bg-slate-700 whitespace-nowrap"
                  >
                    Preset Headshot
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-emerald-400 text-slate-950 hover:bg-emerald-300 rounded-lg"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
