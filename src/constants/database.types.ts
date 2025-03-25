export type Database = {
  tables: {
    users: {
      columns: {
        id: {
          type: 'uuid';
          primary: true;
        };
        email: {
          type: 'text';
          unique: true;
        };
      };
    };
  };
};
