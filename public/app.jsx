// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const socket = io();
const app = feathers()
  .configure(feathers.socketio(socket))
  .configure(feathers.hooks())
  .configure(feathers.authentication({
    storage: window.localStorage
  }));

const MainComponent = React.createClass({
  getInitialState() {
    app.service('jobs').find({}).then(res => this.setState({ jobs: res.data }));
    return {jobs: [], hideSuccessful: false};
  },
  addJob(job) {
    app.service('jobs').create(job).then(job => {
      var jobs = this.state.jobs;
      jobs.push(job);
      this.setState({ jobs: jobs });
    });
  },
  toggleSuccessful(e) {
    this.setState({ hideSuccessful: (!this.state.hideSuccessful) });
  },
  render() {
    return (
      <div>
        <h1 className="title"> JFP Data </h1>
        <JobTable jobs={this.state.jobs} hideSuccessful={this.state.hideSuccessful}/>
        <button type="button" className="pure-button" onClick={this.toggleSuccessful}> {this.state.hideSuccessful? "Show Successful Requests": "Hide Successful Requests"} </button>
        <PrinterConsole onSubmit={this.addJob}/>
      </div>
    );
  }
});

const JobTable = React.createClass({
  formatTime(date) {
    var date = new Date(date);
    return `${date.getHours()}:${date.getMinutes()} ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`
  },
  render() {
    return (
      <div className="printer-table-container">
        <table className="printer-table pure-table pure-table-striped">
          <thead>
            <tr>
              <th>Printer</th>
              <th>Copies</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {this.props.jobs.map((job, index) => {
              if (!job.success || !this.props.hideSuccessful) {
                return (
                    <tr key={index} className={job.success ? "" : "error-job"}>
                        <td>{job.printer}</td>
                        <td>{job.copies}</td>
                        <td>{this.formatTime(job.createdAt)}</td>
                    </tr>
                  );
                }
            }, this)}
          </tbody>
        </table>
      </div>
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
  submit(ev) {
    this.props.onSubmit(this.state);
    ev.preventDefault();
  },
  render() {
    return (
      <form className="pure-form pure-form-stacked" onSubmit={this.submit}>
        <fieldset>
          <legend>Enter A Job</legend>
          <label for="printer">Printer</label>
          <input type="text" name="printer" className="flex flex-1" value={this.state.printer} onChange={this.updatePrinter} />
          <label for="success">Successful</label>
          <input type="number" name="success" className="flex flex-1" value={this.state.success} onChange={this.updateSuccess} />
          <label for="copies">Copies</label>
          <input type="number" name="copies" className="flex flex-1" value={this.state.copies} onChange={this.updateCopies} />
          <button className="button-primary pure-button" type="submit">Send</button>
        </fieldset>
      </form>
    );
  }
});

app.authenticate().then(() => {
  ReactDOM.render(<div>
    <MainComponent />
  </div>, document.querySelector("#container"));
}).catch(error => {
  if(error.code === 401) {
    window.location.href = '/login.html'
  }
  console.error(error);
});


