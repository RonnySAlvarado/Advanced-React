const { forwardTo } = require("prisma-binding");

const Query = {
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  me(parent, args, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.userId) {
      return null;
    } else {
      return ctx.db.query.user(
        {
          where: { id: ctx.request.userId }
        },
        info
      );
    }
  }
  // async items(parent, args, ctx, info) {
  //   console.log("Getting Items!!");
  //   const items = await ctx.db.query.items();
  //   return items;
  // }
};

module.exports = Query;
