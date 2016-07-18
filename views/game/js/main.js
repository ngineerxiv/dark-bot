(function(renderDomId) {
    "use strict";

    function loadUsers(callback) {
        const XHR = new XMLHttpRequest();
        XHR.addEventListener('load', function(event) {
            callback(JSON.parse(event.target.response));
        });
        XHR.addEventListener('error', function(event) {
            console.log(event);
        });
        XHR.open('GET', '/game/api/v1/users');
        XHR.send();
    };

    class UserStatusTable extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                users: []
            };
        }

        componentDidMount() {
            loadUsers((json) => this.setState({
                users:json
            }));
        }

        render() {
            const rows = this.state.users.map((u) => {
                return (
                    <UserStatusRow
                    name={u.name}
                    hitPoint={u.hitPoint.current}
                    maxHitPoint={u.hitPoint.max}
                    magicPoint={u.magicPoint.current}
                    maxMagicPoint={u.magicPoint.max}
                    weaponAttack={u.equipment.weapon.averageOfAttack}
                    weaponDivergence={u.equipment.weapon.divergenceOfAttack}
                    paramAttack={u.parameter.attackPower}
                    paramSkill={u.parameter.skillPoint}
                    paramMind={u.parameter.mindPower}
                    paramUnstability={u.parameter.mindStability}
                    spells={u.spells.map((s) => s.name).join(",")}
                    />
                    );
            });
            return (
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>名前</th>
                            <th>HitPoint</th>
                            <th>MagicPoint</th>
                            <th>装備威力</th>
                            <th>ばらつき</th>
                            <th>基礎攻撃力</th>
                            <th>技能</th>
                            <th>精神力</th>
                            <th>精神不安定さ</th>
                            <th>使える魔法</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            );
        };
    };

    class UserStatusRow extends React.Component {
        render() {
            return (
                <tr>
                    <th>{this.props.name}</th>
                    <th>{this.props.hitPoint} / {this.props.maxHitPoint}</th>
                    <th>{this.props.magicPoint} / {this.props.maxMagicPoint}</th>
                    <th>{this.props.weaponAttack}</th>
                    <th>{this.props.weaponDivergence}</th>
                    <th>{this.props.paramAttack}</th>
                    <th>{this.props.paramSkill}</th>
                    <th>{this.props.paramMind}</th>
                    <th>{this.props.paramUnstability}</th>
                    <th>{this.props.spells}</th>
                </tr>
            );
        };
    };

    ReactDOM.render(
        <UserStatusTable />,
        document.getElementById(renderDomId)
    );
})("darkgame")
