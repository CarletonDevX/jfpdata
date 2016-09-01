// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const socket = io();
const app = feathers()
  .configure(feathers.socketio(socket))
  .configure(feathers.hooks())
  .configure(feathers.authentication({
    storage: window.localStorage
  }));

const JobTable = React.createClass({
    getInitialState() {
      app.service('jobs').find({}).then(res => this.setState({ jobs: res.data }));
      return {jobs: []};
    },
    render() {
      return (
        <table>
          <thead>
            <tr>
              <th>Printer</th>
              <th>Copies</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {this.state.jobs.map((job, index) => {
              return (
                <tr key={index}>
                    <td>{job.printer}</td>
                    <td>{job.copies}</td>
                    <td>{job.createdAt}</td>
                </tr>
              );
            }, this)}
          </tbody>
        </table>
      );
    }
});

const PrinterConsole = React.createClass({
  getInitialState() {
    return { printer: 'printer', success: 0, copies: 0 };
  },
  updatePrinter(ev) {
    this.setState({ printer: ev.target.value });
  },
  updateSuccess(ev) {
    this.setState({ success: Number(ev.target.value) });
  },
  updateCopies(ev) {
    this.setState({ copies: Number(ev.target.value) });
  },
  addPrinter(ev) {
    app.service('jobs').create({
      printer: this.state.printer,
      success: this.state.success,
      copies: this.state.copies,
    }).then(() => this.setState(this.getInitialState()));
    ev.preventDefault();
  },
  render() {
    return (
      <form className="flex flex-row flex-space-between" onSubmit={this.addPrinter}>
        <input type="text" name="printer" className="flex flex-1" value={this.state.printer} onChange={this.updatePrinter} />
        <input type="number" name="success" className="flex flex-1" value={this.state.success} onChange={this.updateSuccess} />
        <input type="number" name="copies" className="flex flex-1" value={this.state.copies} onChange={this.updateCopies} />
        <button className="button-primary" type="submit">Send</button>
      </form>
    );
  }
});

app.authenticate().then(() => {
  ReactDOM.render(<div id="app" className="flex flex-column">
    <JobTable />
    <PrinterConsole />
  </div>, document.querySelector("#container"));
}).catch(error => {
  if(error.code === 401) {
    window.location.href = '/login.html'
  }
  console.error(error);
});


