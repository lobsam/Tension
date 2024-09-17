<template>
    <div class="contain">
    <div class="loader"></div>
    </div>
</template>

<style>

.contain {
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    width: 100vw;      /* Full width of the viewport */
    height: 100vh;     /* Full height of the viewport */
    background-color: rgba(0, 0, 0, 1); /* Optional background with opacity */
}
/* HTML: <div class="loader"></div> */
.loader {
  display: inline-grid;
  width: 90px;
  aspect-ratio: 1;
  clip-path: polygon(100% 50%,85.36% 85.36%,50% 100%,14.64% 85.36%,0% 50%,14.64% 14.64%,50% 0%,85.36% 14.64%);
  background: #574951;
  animation: l2 6s infinite linear;
}
.loader:before,
.loader:after {
  content:"";
  grid-area: 1/1;
  background: #83988E;
  clip-path: polygon(100% 50%,81.17% 89.09%,38.87% 98.75%,4.95% 71.69%,4.95% 28.31%,38.87% 1.25%,81.17% 10.91%);
  margin: 10%;
  animation: inherit;
  animation-duration: 10s;
}
.loader:after {
  background: #e9f0e4;
  clip-path: polygon(100% 50%,75% 93.3%,25% 93.3%,0% 50%,25% 6.7%,75% 6.7%);
  margin: 20%;
  animation-duration: 3s;
  animation-direction: reverse;
}
@keyframes l2 {to{rotate: 1turn}}
</style>