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
    app.service('jobs').find({}).then(res => {
      var jobs = res.data;
      jobs.sort(function(a,b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      this.setState({ jobs: res.data });
    });
    return {jobs: [], hideSuccessful: false};
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

ReactDOM.render(
  <div>
    <MainComponent />
  </div>, document.querySelector("#container"));

