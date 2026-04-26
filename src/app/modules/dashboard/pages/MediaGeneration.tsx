import { useState } from 'react';
import { ArrowLeft, Download, Eye, FolderPlus, Check, Play, Image as ImageIcon, Film, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

type Channel = 'xiaohongshu' | 'moments' | 'wechat' | 'video';

interface MediaItem {
  id: number;
  channel: Channel;
  type: 'image' | 'video' | 'cover';
  url: string;
  thumbnail?: string;
  selected: boolean;
}

const CHANNEL_NAMES = {
  xiaohongshu: '小红书',
  moments: '朋友圈',
  wechat: '公众号',
  video: '视频号'
};

export default function MediaGeneration() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    // 小红书图片
    { id: 1, channel: 'xiaohongshu', type: 'image', url: 'xhs1', selected: false },
    { id: 2, channel: 'xiaohongshu', type: 'image', url: 'xhs2', selected: false },
    { id: 3, channel: 'xiaohongshu', type: 'image', url: 'xhs3', selected: false },
    // 朋友圈图片
    { id: 4, channel: 'moments', type: 'image', url: 'moments1', selected: false },
    { id: 5, channel: 'moments', type: 'image', url: 'moments2', selected: false },
    { id: 6, channel: 'moments', type: 'image', url: 'moments3', selected: false },
    // 公众号图片
    { id: 7, channel: 'wechat', type: 'image', url: 'wechat1', selected: false },
    { id: 8, channel: 'wechat', type: 'image', url: 'wechat2', selected: false },
    // 视频号封面
    { id: 9, channel: 'video', type: 'cover', url: 'cover1', selected: false },
    { id: 10, channel: 'video', type: 'cover', url: 'cover2', selected: false },
    // 视频号视频
    { id: 11, channel: 'video', type: 'video', url: 'video1', thumbnail: 'video1_thumb', selected: false }
  ]);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showLibraryModal, setShowLibraryModal] = useState(false);

  const houseName = '中海汇德里';
  const selectedCount = mediaItems.filter(item => item.selected).length;

  const groupedMedia = {
    xiaohongshu: mediaItems.filter(item => item.channel === 'xiaohongshu'),
    moments: mediaItems.filter(item => item.channel === 'moments'),
    wechat: mediaItems.filter(item => item.channel === 'wechat'),
    videoCover: mediaItems.filter(item => item.channel === 'video' && item.type === 'cover'),
    video: mediaItems.filter(item => item.channel === 'video' && item.type === 'video')
  };

  function showMessage(msg: string) {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }

  function toggleSelection(itemId: number) {
    setMediaItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, selected: !item.selected } : item
    ));
  }

  function selectAllInChannel(channel: Channel, type?: 'image' | 'video' | 'cover') {
    setMediaItems(prev => prev.map(item =>
      item.channel === channel && (!type || item.type === type)
        ? { ...item, selected: true }
        : item
    ));
  }

  function downloadItem(item: MediaItem) {
    showMessage(`开始下载${item.type === 'video' ? '视频' : '图片'}`);
  }

  function downloadChannel(channel: Channel, type?: 'image' | 'video' | 'cover') {
    const items = mediaItems.filter(item =>
      item.channel === channel && (!type || item.type === type)
    );
    showMessage(`开始下载${items.length}个文件`);
  }

  function addToLibrary() {
    const selected = mediaItems.filter(item => item.selected);
    if (selected.length === 0) {
      showMessage('请先选择要加入素材库的内容');
      return;
    }
    setShowLibraryModal(true);
  }

  function confirmAddToLibrary() {
    const selected = mediaItems.filter(item => item.selected);
    showMessage(`已将${selected.length}个素材加入素材库`);
    setShowLibraryModal(false);
    setMediaItems(prev => prev.map(item => ({ ...item, selected: false })));
  }

  function handleConfirm() {
    showMessage('确认完成！');
    setTimeout(() => {
      navigate(`/tasks/${id}/execute?step=3`);
    }, 1500);
  }

  const getChannelColor = (channel: Channel) => {
    const colors = {
      xiaohongshu: 'bg-[#FFE7D6] text-[#FA8C16]',
      moments: 'bg-[#FFE5F0] text-[#FF6B9D]',
      wechat: 'bg-[#E8FFEA] text-[#00B42A]',
      video: 'bg-[#E8F3FF] text-[#165DFF]'
    };
    return colors[channel];
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-32">
      {/* 顶部导航栏 */}
      <header className="bg-gradient-to-br from-[#FA8C16] to-[#FF9500] px-4 pt-3 pb-6 sticky top-0 z-20 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(`/tasks/${id}/execute?step=3`)}
            className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center active:bg-white/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-[18px] font-semibold text-white">图片视频生成</h1>
          <div className="w-9"></div>
        </div>

        {/* 任务信息卡片 */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[20px]">🏠</span>
            <span className="text-[16px] font-bold text-[#1D2129]">{houseName}</span>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-[#86909C]">
            <ImageIcon className="w-4 h-4" />
            <span>已生成 {mediaItems.length} 个营销素材</span>
          </div>
        </div>
      </header>

      <div className="px-4 mt-4 space-y-4">
        {/* 小红书素材 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className={`text-[12px] px-2 py-1 rounded-lg font-medium ${getChannelColor('xiaohongshu')}`}>
                {CHANNEL_NAMES.xiaohongshu}
              </span>
              <span className="text-[13px] text-[#86909C]">{groupedMedia.xiaohongshu.length}张图片</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => selectAllInChannel('xiaohongshu')}
                className="text-[12px] text-[#FA8C16] active:opacity-70"
              >
                全选
              </button>
              <button
                onClick={() => downloadChannel('xiaohongshu')}
                className="text-[12px] text-[#FA8C16] active:opacity-70"
              >
                全部下载
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {groupedMedia.xiaohongshu.map(item => (
              <div
                key={item.id}
                className={`relative rounded-xl overflow-hidden aspect-square group ${
                  item.selected ? 'ring-2 ring-[#FA8C16]' : ''
                }`}
              >
                <img
                  src={`https://picsum.photos/seed/${item.url}/400/400`}
                  alt="小红书图片"
                  className="w-full h-full object-cover cursor-pointer"
                />
                {/* 选择框 */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSelection(item.id); }}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  {item.selected ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-white rounded-full"></div>
                  )}
                </button>
                {/* 操作按钮 */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); setPreviewImage(`https://picsum.photos/seed/${item.url}/800/800`); }}
                    className="flex-1 bg-white/20 backdrop-blur-sm rounded py-1 text-white text-[10px] flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    预览
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); downloadItem(item); }}
                    className="flex-1 bg-white/20 backdrop-blur-sm rounded py-1 text-white text-[10px] flex items-center justify-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    下载
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 朋友圈素材 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className={`text-[12px] px-2 py-1 rounded-lg font-medium ${getChannelColor('moments')}`}>
                {CHANNEL_NAMES.moments}
              </span>
              <span className="text-[13px] text-[#86909C]">{groupedMedia.moments.length}张图片</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => selectAllInChannel('moments')}
                className="text-[12px] text-[#FF6B9D] active:opacity-70"
              >
                全选
              </button>
              <button
                onClick={() => downloadChannel('moments')}
                className="text-[12px] text-[#FF6B9D] active:opacity-70"
              >
                全部下载
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {groupedMedia.moments.map(item => (
              <div
                key={item.id}
                className={`relative rounded-xl overflow-hidden aspect-square group ${
                  item.selected ? 'ring-2 ring-[#FF6B9D]' : ''
                }`}
              >
                <img
                  src={`https://picsum.photos/seed/${item.url}/400/400`}
                  alt="朋友圈图片"
                  className="w-full h-full object-cover cursor-pointer"
                />
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSelection(item.id); }}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  {item.selected ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-white rounded-full"></div>
                  )}
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); setPreviewImage(`https://picsum.photos/seed/${item.url}/800/800`); }}
                    className="flex-1 bg-white/20 backdrop-blur-sm rounded py-1 text-white text-[10px] flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    预览
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); downloadItem(item); }}
                    className="flex-1 bg-white/20 backdrop-blur-sm rounded py-1 text-white text-[10px] flex items-center justify-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    下载
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 公众号素材 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className={`text-[12px] px-2 py-1 rounded-lg font-medium ${getChannelColor('wechat')}`}>
                {CHANNEL_NAMES.wechat}
              </span>
              <span className="text-[13px] text-[#86909C]">{groupedMedia.wechat.length}张图片</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => selectAllInChannel('wechat')}
                className="text-[12px] text-[#00B42A] active:opacity-70"
              >
                全选
              </button>
              <button
                onClick={() => downloadChannel('wechat')}
                className="text-[12px] text-[#00B42A] active:opacity-70"
              >
                全部下载
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {groupedMedia.wechat.map(item => (
              <div
                key={item.id}
                className={`relative rounded-xl overflow-hidden aspect-[16/9] group ${
                  item.selected ? 'ring-2 ring-[#00B42A]' : ''
                }`}
              >
                <img
                  src={`https://picsum.photos/seed/${item.url}/800/450`}
                  alt="公众号图片"
                  className="w-full h-full object-cover cursor-pointer"
                />
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSelection(item.id); }}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  {item.selected ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-white rounded-full"></div>
                  )}
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); setPreviewImage(`https://picsum.photos/seed/${item.url}/1200/675`); }}
                    className="flex-1 bg-white/20 backdrop-blur-sm rounded py-1 text-white text-[10px] flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    预览
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); downloadItem(item); }}
                    className="flex-1 bg-white/20 backdrop-blur-sm rounded py-1 text-white text-[10px] flex items-center justify-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    下载
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 视频号素材 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-[12px] px-2 py-1 rounded-lg font-medium ${getChannelColor('video')}`}>
              {CHANNEL_NAMES.video}
            </span>
            <span className="text-[13px] text-[#86909C]">{groupedMedia.videoCover.length}个封面 + {groupedMedia.video.length}个视频</span>
          </div>

          {/* 封面图 */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[13px] font-medium text-[#1D2129]">视频封面</div>
              <div className="flex gap-2">
                <button
                  onClick={() => selectAllInChannel('video', 'cover')}
                  className="text-[12px] text-[#165DFF] active:opacity-70"
                >
                  全选
                </button>
                <button
                  onClick={() => downloadChannel('video', 'cover')}
                  className="text-[12px] text-[#165DFF] active:opacity-70"
                >
                  全部下载
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {groupedMedia.videoCover.map(item => (
                <div
                  key={item.id}
                  className={`relative rounded-xl overflow-hidden aspect-[9/16] group ${
                    item.selected ? 'ring-2 ring-[#165DFF]' : ''
                  }`}
                >
                  <img
                    src={`https://picsum.photos/seed/${item.url}/360/640`}
                    alt="视频封面"
                    className="w-full h-full object-cover cursor-pointer"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-sm rounded text-white text-[10px]">
                    封面
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleSelection(item.id); }}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
                  >
                    {item.selected ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-white rounded-full"></div>
                    )}
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); setPreviewImage(`https://picsum.photos/seed/${item.url}/720/1280`); }}
                      className="flex-1 bg-white/20 backdrop-blur-sm rounded py-1 text-white text-[10px] flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      预览
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); downloadItem(item); }}
                      className="flex-1 bg-white/20 backdrop-blur-sm rounded py-1 text-white text-[10px] flex items-center justify-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      下载
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 视频 */}
          <div>
            <div className="text-[13px] font-medium text-[#1D2129] mb-2">营销视频</div>
            {groupedMedia.video.map(item => (
              <div
                key={item.id}
                className={`relative rounded-xl overflow-hidden bg-black mb-3 ${
                  item.selected ? 'ring-2 ring-[#165DFF]' : ''
                }`}
              >
                <video
                  src="https://www.w3schools.com/html/mov_bbb.mp4"
                  poster={`https://picsum.photos/seed/${item.thumbnail}/800/450`}
                  controls
                  className="w-full"
                />
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSelection(item.id); }}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center z-10"
                >
                  {item.selected ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-white rounded-full"></div>
                  )}
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <button
                onClick={() => downloadChannel('video', 'video')}
                className="flex-1 py-2.5 bg-[#F7F8FA] border border-[#E5E6EB] rounded-lg text-[13px] text-[#4E5969] flex items-center justify-center gap-1.5 active:bg-[#E5E6EB] transition-colors"
              >
                <Download className="w-4 h-4" />
                下载视频
              </button>
            </div>
          </div>
        </div>

        {/* 提示卡片 */}
        <div className="bg-[#E8F3FF] border-l-4 border-[#165DFF] rounded-xl px-4 py-3">
          <div className="flex items-start gap-2">
            <span className="text-[#165DFF] text-[16px] flex-shrink-0 mt-0.5">💡</span>
            <div className="flex-1">
              <div className="text-[13px] font-medium text-[#165DFF] mb-1">分享建议</div>
              <div className="text-[12px] text-[#4E5969] leading-relaxed">
                生成的营销物料已包含楼盘核心卖点，可直接用于各平台发布。如需自定义文案，可先下载后在本地编辑。
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm px-4 py-4 shadow-[0_-2px_20px_rgba(0,0,0,0.08)] border-t border-[#E5E6EB] z-50">
        <div className="flex gap-3">
          <button
            onClick={addToLibrary}
            className={`flex-1 py-3.5 rounded-xl text-[15px] font-semibold transition-all flex items-center justify-center gap-2 ${
              selectedCount > 0
                ? 'bg-[#F7F8FA] text-[#FA8C16] border-2 border-[#FA8C16] active:bg-[#FFF7E6]'
                : 'bg-[#F7F8FA] text-[#86909C] border-2 border-[#E5E6EB]'
            }`}
          >
            <FolderPlus className="w-5 h-5" />
            加入素材库 {selectedCount > 0 && `(${selectedCount})`}
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3.5 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#FA8C16] to-[#FF9500] text-white shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            确认完成
          </button>
        </div>
      </div>

      {/* 图片预览 */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPreviewImage(null);
            }}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center active:bg-white/30 transition-all z-10"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <img
            src={previewImage}
            alt="预览"
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* 加入素材库确认弹窗 */}
      {showLibraryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center px-4" onClick={() => setShowLibraryModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-[360px] overflow-hidden shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 pt-6 pb-4">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-[#FA8C16] to-[#FF9500] rounded-full flex items-center justify-center mx-auto mb-3">
                  <FolderPlus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-[20px] font-bold text-[#1D2129] mb-2">加入素材库</h3>
                <p className="text-[13px] text-[#86909C]">
                  确认将选中的 {selectedCount} 个素材加入素材库吗？
                </p>
              </div>
              <div className="bg-[#F7F8FA] rounded-2xl p-4 text-[13px] text-[#4E5969]">
                加入素材库后，可在创建其他任务时直接使用这些素材
              </div>
            </div>
            <div className="flex gap-3 p-4 bg-[#F7F8FA]">
              <button onClick={() => setShowLibraryModal(false)} className="flex-1 py-3.5 rounded-xl bg-white text-[#4E5969] font-semibold active:scale-95 transition-all shadow-sm">
                取消
              </button>
              <button onClick={confirmAddToLibrary} className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#FA8C16] to-[#FF9500] text-white font-semibold active:scale-95 transition-all shadow-md">
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast提示 */}
      {showToast && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1D2129]/90 backdrop-blur-sm text-white px-6 py-3.5 rounded-2xl text-[14px] z-[10000] animate-fade-in pointer-events-none max-w-[80vw] text-center shadow-2xl">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
