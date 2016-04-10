// Description:
//   エラーハンドリング用
//

module.exports = (robot => {
    robot.error((err, res) => {
        robot.logger.error(err);
        res && res.reply(err);
    });
})
