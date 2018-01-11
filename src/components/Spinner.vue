<template lang="pug">
  .container.text-center
    p
      i.icon-spinner5
    p {{label}}
</template>



<script>
  export default {
    props: {
      label: {
        type: String,
        default: 'loading'
      }
    }
  }
</script>


<style lang="sass">
  @keyframes anim-rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)

  .icon-spinner5
    animation: anim-rotate 1s infinite linear
    display: inline-block
    font-size: 2rem
</style>
