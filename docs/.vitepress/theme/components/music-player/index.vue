<template>
  <div class="music-player">
    <div class="tool-header">
      <h2>简易音乐播放器</h2>
      <p>优雅的音乐播放器，支持本地音乐播放和播放列表管理</p>
    </div>

    <div class="player-container">
      <!-- 播放器主体 -->
      <div class="player-main">
        <div class="album-art" :class="{ playing: isPlaying }">
          <div v-if="currentSong.cover" class="album-image">
            <img :src="currentSong.cover" :alt="currentSong.title">
          </div>
          <div v-else class="album-placeholder">
            <span class="music-icon">🎵</span>
          </div>
          <div class="vinyl" v-if="isPlaying"></div>
        </div>

        <div class="song-info">
          <h3 class="song-title">{{ currentSong.title || '选择音乐开始播放' }}</h3>
          <p class="song-artist">{{ currentSong.artist || '未知艺术家' }}</p>
          <p class="song-album" v-if="currentSong.album">{{ currentSong.album }}</p>
        </div>

        <div class="progress-container">
          <div class="progress-time">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(duration) }}</span>
          </div>
          <div class="progress-bar" @click="seekAudio">
            <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
            <div class="progress-handle" :style="{ left: progressPercentage + '%' }"></div>
          </div>
        </div>

        <div class="player-controls">
          <button class="control-btn" @click="toggleShuffle" :class="{ active: isShuffle }">
            <span class="icon">🔀</span>
          </button>
          <button class="control-btn" @click="previousSong" :disabled="!hasPrevious">
            <span class="icon">⏮</span>
          </button>
          <button class="control-btn play-pause" @click="togglePlay">
            <span class="icon">{{ isPlaying ? '⏸' : '▶' }}</span>
          </button>
          <button class="control-btn" @click="nextSong" :disabled="!hasNext">
            <span class="icon">⏭</span>
          </button>
          <button class="control-btn" @click="toggleRepeat" :class="{ active: isRepeat }">
            <span class="icon">{{ repeatIcon }}</span>
          </button>
        </div>

        <div class="volume-controls">
          <span class="volume-icon">🔊</span>
          <div class="volume-bar" @click="adjustVolume">
            <div class="volume-level" :style="{ width: volume * 100 + '%' }"></div>
          </div>
          <span class="volume-percent">{{ Math.round(volume * 100) }}%</span>
        </div>
      </div>

      <!-- 播放列表 -->
      <div class="playlist-section">
        <div class="playlist-header">
          <h3>播放列表</h3>
          <div class="playlist-actions">
            <button @click="addMusicFiles" class="action-btn">
              <span class="icon">➕</span> 添加音乐
            </button>
            <button @click="clearPlaylist" class="action-btn" :disabled="playlist.length === 0">
              <span class="icon">🗑️</span> 清空列表
            </button>
          </div>
        </div>

        <div class="playlist-container" v-if="playlist.length > 0">
          <div 
            v-for="(song, index) in playlist" 
            :key="index"
            class="playlist-item"
            :class="{ active: currentIndex === index, playing: currentIndex === index && isPlaying }"
            @click="playSong(index)"
          >
            <div class="item-info">
              <div class="item-title">{{ song.title || '未知标题' }}</div>
              <div class="item-artist">{{ song.artist || '未知艺术家' }}</div>
            </div>
            <div class="item-duration">{{ formatTime(song.duration) }}</div>
            <button class="remove-btn" @click.stop="removeSong(index)">
              <span class="icon">❌</span>
            </button>
          </div>
        </div>

        <div v-else class="empty-playlist">
          <div class="empty-icon">🎵</div>
          <p>播放列表为空</p>
          <p>点击"添加音乐"按钮添加音乐文件</p>
        </div>
      </div>
    </div>

    <!-- 隐藏的音频元素 -->
    <audio 
      ref="audioElement"
      @timeupdate="updateProgress"
      @ended="handleSongEnd"
      @loadedmetadata="updateDuration"
    ></audio>

    <!-- 文件输入 -->
    <input 
      type="file" 
      ref="fileInput"
      multiple
      accept="audio/*"
      @change="handleFileSelect"
      style="display: none"
    >
  </div>
</template>

<script>
export default {
  name: 'MusicPlayer',
  data() {
    return {
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.7,
      isShuffle: false,
      isRepeat: false,
      currentIndex: -1,
      playlist: [],
      audioContext: null,
      analyser: null
    };
  },
  computed: {
    currentSong() {
      return this.currentIndex >= 0 && this.playlist[this.currentIndex] 
        ? this.playlist[this.currentIndex] 
        : {};
    },
    progressPercentage() {
      return this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
    },
    hasPrevious() {
      return this.playlist.length > 0 && this.currentIndex > 0;
    },
    hasNext() {
      return this.playlist.length > 0 && this.currentIndex < this.playlist.length - 1;
    },
    repeatIcon() {
      return this.isRepeat ? '🔂' : '🔁';
    }
  },
  mounted() {
    // 初始化音量
    if (this.$refs.audioElement) {
      this.$refs.audioElement.volume = this.volume;
    }
    
    // 尝试从本地存储加载播放列表
    this.loadPlaylist();
  },
  methods: {
    // 添加音乐文件
    addMusicFiles() {
      this.$refs.fileInput.click();
    },
    
    // 处理文件选择
    async handleFileSelect(event) {
      const files = event.target.files;
      if (!files.length) return;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('audio/')) continue;
        
        const song = {
          file: file,
          title: this.extractTitle(file.name),
          artist: '未知艺术家',
          album: '',
          duration: 0,
          url: URL.createObjectURL(file)
        };
        
        // 获取音频时长
        await this.getAudioDuration(song);
        
        this.playlist.push(song);
      }
      
      // 保存播放列表到本地存储
      this.savePlaylist();
      
      // 如果当前没有播放歌曲，自动播放第一首
      if (this.currentIndex === -1 && this.playlist.length > 0) {
        this.playSong(0);
      }
      
      // 重置文件输入
      event.target.value = '';
    },
    
    // 从文件名提取标题
    extractTitle(filename) {
      return filename.replace(/\.[^/.]+$/, ""); // 移除扩展名
    },
    
    // 获取音频时长
    getAudioDuration(song) {
      return new Promise((resolve) => {
        const audio = new Audio();
        audio.src = song.url;
        audio.addEventListener('loadedmetadata', () => {
          song.duration = audio.duration;
          resolve();
        });
        audio.addEventListener('error', () => {
          song.duration = 0;
          resolve();
        });
      });
    },
    
    // 播放指定索引的歌曲
    playSong(index) {
      if (index < 0 || index >= this.playlist.length) return;
      
      this.currentIndex = index;
      const audio = this.$refs.audioElement;
      audio.src = this.playlist[index].url;
      audio.load();
      
      this.play();
    },
    
    // 播放
    play() {
      this.$refs.audioElement.play()
        .then(() => {
          this.isPlaying = true;
        })
        .catch(error => {
          console.error('播放失败:', error);
          this.isPlaying = false;
        });
    },
    
    // 暂停
    pause() {
      this.$refs.audioElement.pause();
      this.isPlaying = false;
    },
    
    // 切换播放/暂停
    togglePlay() {
      if (this.playlist.length === 0) {
        this.addMusicFiles();
        return;
      }
      
      if (this.currentIndex === -1) {
        this.playSong(0);
        return;
      }
      
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    },
    
    // 上一首
    previousSong() {
      if (!this.hasPrevious) return;
      
      const newIndex = this.currentIndex - 1;
      this.playSong(newIndex);
    },
    
    // 下一首
    nextSong() {
      if (!this.hasNext) return;
      
      let newIndex;
      if (this.isShuffle) {
        // 随机播放模式下随机选择下一首
        do {
          newIndex = Math.floor(Math.random() * this.playlist.length);
        } while (newIndex === this.currentIndex && this.playlist.length > 1);
      } else {
        newIndex = this.currentIndex + 1;
      }
      
      this.playSong(newIndex);
    },
    
    // 歌曲结束处理
    handleSongEnd() {
      if (this.isRepeat) {
        // 单曲循环
        this.$refs.audioElement.currentTime = 0;
        this.play();
      } else if (this.hasNext) {
        // 播放下一首
        this.nextSong();
      } else {
        // 播放列表结束
        this.isPlaying = false;
        this.currentTime = 0;
      }
    },
    
    // 切换随机播放
    toggleShuffle() {
      this.isShuffle = !this.isShuffle;
    },
    
    // 切换循环模式
    toggleRepeat() {
      this.isRepeat = !this.isRepeat;
    },
    
    // 更新播放进度
    updateProgress() {
      this.currentTime = this.$refs.audioElement.currentTime;
    },
    
    // 更新总时长
    updateDuration() {
      this.duration = this.$refs.audioElement.duration;
      
      // 更新当前歌曲的时长信息
      if (this.currentIndex >= 0 && this.playlist[this.currentIndex]) {
        this.playlist[this.currentIndex].duration = this.duration;
        this.savePlaylist();
      }
    },
    
    // 跳转播放进度
    seekAudio(event) {
      const progressBar = event.currentTarget;
      const clickPosition = event.clientX - progressBar.getBoundingClientRect().left;
      const progressWidth = progressBar.offsetWidth;
      const percentage = clickPosition / progressWidth;
      
      this.$refs.audioElement.currentTime = this.duration * percentage;
    },
    
    // 调整音量
    adjustVolume(event) {
      const volumeBar = event.currentTarget;
      const clickPosition = event.clientX - volumeBar.getBoundingClientRect().left;
      const volumeWidth = volumeBar.offsetWidth;
      this.volume = Math.max(0, Math.min(1, clickPosition / volumeWidth));
      
      this.$refs.audioElement.volume = this.volume;
    },
    
    // 从播放列表移除歌曲
    removeSong(index) {
      // 如果移除的是当前正在播放的歌曲
      if (index === this.currentIndex) {
        this.pause();
        this.currentIndex = -1;
      } else if (index < this.currentIndex) {
        this.currentIndex--;
      }
      
      this.playlist.splice(index, 1);
      this.savePlaylist();
    },
    
    // 清空播放列表
    clearPlaylist() {
      this.pause();
      this.currentIndex = -1;
      this.playlist = [];
      this.savePlaylist();
    },
    
    // 格式化时间
    formatTime(seconds) {
      if (isNaN(seconds)) return '0:00';
      
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    },
    
    // 保存播放列表到本地存储
    savePlaylist() {
      // 由于File对象不能直接存储，我们只保存必要的信息
      const simplifiedPlaylist = this.playlist.map(song => ({
        title: song.title,
        artist: song.artist,
        album: song.album,
        duration: song.duration,
        // 注意：URL是临时对象URL，不能持久化存储
      }));
      
      localStorage.setItem('musicPlayerPlaylist', JSON.stringify(simplifiedPlaylist));
      localStorage.setItem('musicPlayerCurrentIndex', this.currentIndex);
    },
    
    // 从本地存储加载播放列表
    loadPlaylist() {
      const savedPlaylist = localStorage.getItem('musicPlayerPlaylist');
      const savedIndex = localStorage.getItem('musicPlayerCurrentIndex');
      
      if (savedPlaylist) {
        try {
          // 注意：由于无法保存文件对象，加载的播放列表只包含元数据
          // 实际使用时需要用户重新添加文件
          this.playlist = JSON.parse(savedPlaylist);
          this.currentIndex = parseInt(savedIndex) || -1;
        } catch (e) {
          console.error('加载播放列表失败:', e);
        }
      }
    }
  },
  beforeUnmount() {
    // 释放对象URL
    this.playlist.forEach(song => {
      if (song.url && song.url.startsWith('blob:')) {
        URL.revokeObjectURL(song.url);
      }
    });
  }
};
</script>

<style scoped>
.music-player {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.tool-header {
  text-align: center;
  margin-bottom: 30px;
}

.tool-header h2 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.tool-header p {
  color: #7f8c8d;
  font-size: 1.1em;
}

.player-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.player-main {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 30px;
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.album-art {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 20px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s;
}

.album-art.playing {
  animation: rotate 20s linear infinite;
}

.album-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.album-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.music-icon {
  font-size: 4em;
}

.vinyl {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  background: #2d3436;
  border: 2px solid #636e72;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.vinyl::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.song-info {
  text-align: center;
  margin-bottom: 20px;
}

.song-title {
  font-size: 1.5em;
  margin: 0 0 5px 0;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artist {
  margin: 0 0 5px 0;
  opacity: 0.9;
}

.song-album {
  margin: 0;
  opacity: 0.7;
  font-size: 0.9em;
}

.progress-container {
  margin-bottom: 20px;
}

.progress-time {
  display: flex;
  justify-content: space-between;
  font-size: 0.9em;
  margin-bottom: 5px;
  opacity: 0.8;
}

.progress-bar {
  position: relative;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  cursor: pointer;
}

.progress {
  height: 100%;
  background: white;
  border-radius: 2px;
  transition: width 0.1s;
}

.progress-handle {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.2s;
}

.progress-bar:hover .progress-handle {
  opacity: 1;
}

.player-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.control-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: white;
}

.control-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-btn.active {
  background: rgba(255, 255, 255, 0.4);
}

.control-btn .icon {
  font-size: 1.2em;
}

.play-pause {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.3);
}

.play-pause .icon {
  font-size: 1.5em;
}

.volume-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.volume-icon {
  font-size: 1.2em;
}

.volume-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  cursor: pointer;
  position: relative;
}

.volume-level {
  height: 100%;
  background: white;
  border-radius: 2px;
  transition: width 0.1s;
}

.volume-percent {
  min-width: 40px;
  text-align: right;
  font-size: 0.9em;
  opacity: 0.8;
}

.playlist-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.playlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.playlist-header h3 {
  margin: 0;
  color: #2c3e50;
}

.playlist-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) {
  background: #e9ecef;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.playlist-container {
  max-height: 300px;
  overflow-y: auto;
}

.playlist-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-radius: 6px;
  margin-bottom: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.playlist-item:hover {
  background-color: #f8f9fa;
}

.playlist-item.active {
  background-color: #e3f2fd;
}

.playlist-item.playing {
  background-color: #e3f2fd;
  position: relative;
}

.playlist-item.playing::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 50%;
  width: 8px;
  height: 8px;
  background: #2196f3;
  border-radius: 50%;
  transform: translateY(-50%);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #2c3e50;
}

.item-artist {
  font-size: 0.9em;
  color: #7f8c8d;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-duration {
  margin: 0 10px;
  color: #95a5a6;
  font-size: 0.9em;
}

.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
  padding: 5px;
  border-radius: 4px;
}

.remove-btn:hover {
  opacity: 1;
  background: rgba(231, 76, 60, 0.1);
}

.empty-playlist {
  text-align: center;
  padding: 40px 20px;
  color: #95a5a6;
}

.empty-icon {
  font-size: 3em;
  margin-bottom: 15px;
}

@media (max-width: 768px) {
  .player-main {
    padding: 20px;
  }
  
  .album-art {
    width: 150px;
    height: 150px;
  }
  
  .player-controls {
    gap: 10px;
  }
  
  .control-btn {
    width: 40px;
    height: 40px;
  }
  
  .play-pause {
    width: 50px;
    height: 50px;
  }
  
  .playlist-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .playlist-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .action-btn {
    flex: 1;
    justify-content: center;
  }
}
</style>