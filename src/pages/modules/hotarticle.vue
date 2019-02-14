<template>
  <app-layout id="hotarticle">
    <div class="con">
      <div class="title">{{pageData.title}}</div>
      <div class="updateDate">{{pageData.publishDate}}</div>
      <div v-html="pageData.articleContent||''"></div>
    </div>
    
  </app-layout>
</template>

<script>
    export default {
      name:'ex-hotarticle',
      data() {
        return {
          pageData:{}
        };
      },
      mounted(){
        this.getData();
      },
      methods: {
        async getData() {
            let data={content: {
                id: this.$route.params.id
            }};

            let res=await this.$post('/CRM/apphotarticle/queryHotArticleDetail.json',data);
            if(res.errcode==0){
                let con=res.content;

                con.articleContent=con.articleContent.replace(/data-src/g,'src');
                this.pageData=res.content;
            }
        }
      }
    }
</script>

<style lang="scss" scoped>
  .container{background: #fff;}
  #hotarticle{
    
    .con{padding: .2rem;}
    
    .title{font-size:.18rem;line-height:.25rem;font-weight:700;}
    .updateDate{color:#999;font-size:.12rem;padding:.14rem 0;}
  }
</style>
