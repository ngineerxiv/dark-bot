(function(renderDomId) {
    "use strict";

    function loadUsers(callback) {
        const req = new XMLHttpRequest();
        req.addEventListener('load', function(event) {
            callback(JSON.parse(event.target.response));
        });
        req.addEventListener('error', function(event) {
            console.log(event);
        });
        req.open('GET', '/game/api/v1/users');
        req.send();
    };

    class UserBitnessTable extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                users: []
            };
        }

        componentDidMount() {
            loadUsers((json) => {
                const users = json.sort((x, y) => {
                    if (x.bitness > y.bitness) {
                        return -1;
                    } else if (x.bitness < y.bitness) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                this.setState({
                    users:users
                })
            });
        }

        render() {
            const rows = this.state.users.map((u) => {
                return (
                    <UserBitnessRow
                    name={u.name}
                    bitness={u.bitness}
                    />
                    );
            });
            return (
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>名前</th>
                            <th>社会からうけたつらさ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            );
        };
    };

    class UserBitnessRow extends React.Component {
        render() {
            return (
                <tr>
                    <th>{this.props.name}</th>
                    <th>{this.props.bitness}</th>
                </tr>
            );
        };
    };

    ReactDOM.render(
        <UserBitnessTable />,
        document.getElementById(renderDomId)
    );
})("darkgame")
