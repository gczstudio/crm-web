<template>
  <div class="app-wrapper">
    <navbar />
    <sidebar class="sidebar-container" :style="getSideBarBg" />
    <div class="main-container hasTagsView">
      <div class="fixed-header">
        
        <tags-view />
      </div>
      <app-main />
    </div>
    <!-- <fixed-right-tool /> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { SettingsModule } from '@/store/modules/settings'
import { AppMain, Navbar, Sidebar, TagsView, FixedRightTool } from './components'

@Component({
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Sidebar,
    TagsView,
    FixedRightTool
  }
})
export default class extends Vue {

  get getSideBarBg () {
    return {
      background: `url(${require('../assets/images/theme/'+(SettingsModule.themeType || "custom")+'/menu.png')}) no-repeat top center / 72px 100%`
    }
  }

}
</script>

<style lang="scss" scoped>
.app-wrapper {
  @include clearfix;
  // position: relative;
  height: 100%;
  width: 100%;
}

.main-container {
  min-height: 100%;
  transition: margin-left .28s;
  margin-left: 60px;
  // position: relative;
}

.sidebar-container {
  float: left;
  height: calc(100% - 60px);
  background: url('../assets/images/theme/custom/menu.png') no-repeat top center;
  background-size: 72px 100%;
  width: 60px !important;
}
@media screen and (max-width: 1680px) { 
  .main-container {
    margin-left: 56px;
  }
  .sidebar-container {
    height: calc(100% - 50px);
    width: 56px !important;
  }
}

</style>
