<template>
  <!-- 四象限分析法 -->
  <div>
    <Header />
    <div class="body-main">
      <!-- 紧急-不重要 -->
      <div class="urgency-unimportance">
        <QuadrantItem title="紧急-不重要" data-name="urgencyUnimportance" />
      </div>
      <!-- 紧急-重要 -->
      <div class="urgency-importance">
        <QuadrantItem title="紧急-重要" data-name="urgencyImportance" />
      </div>
      <!-- 不紧急-不重要 -->
      <div class="not-urgency-unimportance">
        <QuadrantItem title="不紧急-不重要" data-name="notUrgencyUnimportance" />
      </div>
      <!-- 不紧急-重要 -->
      <div class="not-urgency-importance">
        <QuadrantItem title="不紧急-重要" data-name="notUrgencyImportance" />
      </div>
    </div>

  </div>
</template>

<script>
import Header from '@/components/Header/index'
import QuadrantItem from '@/components/QuadrantItem/index'

export default {
  components: {
    Header,
    QuadrantItem
  }
}
</script>

<style lang="scss" scoped>
@mixin titleColor($color){
  /deep/{
    .title{
    background-color: $color;
  }
  }

}
.body-main{
  display: flex;
  justify-content: space-between;
  flex-wrap:wrap;
  height: calc(100vh - 60px);
  width: 100%;
  background-color: #F2EEEE;
  >div{
    width:50%;
    height: 50%;
    overflow-y: auto;
    overflow-x:hidden;
    padding: 10px;
    box-sizing: border-box;
    // background: ;
  }
  .urgency-unimportance{
     @include titleColor(#EEBA4D);
  }
  .urgency-importance{
    @include titleColor(#E3483B);
  }
  .not-urgency-unimportance{
    @include titleColor(#A9DDD9);
  }
  .not-urgency-importance{
    @include titleColor(#21b6af);
  }
}
</style>
