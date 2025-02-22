<template>
    <div>
      <div class="users-content">
        <UserList />
      </div>
    </div>
  </template>
  <script>
  import NavigationBar from '../components/shared/NavigationBar.vue';
  import UserList from '../components/users/UserList.vue';
  
  export default {
    name: 'UsersView',
    components: {
      UserList,
    },
  };
  </script>
  
  <style scoped>
  .users-content {
    margin: 20px;
    padding: 20px;
  }
  
  h2 {
    font-size: 1.8rem;
    color: #2c3e50;
  }
  </style>