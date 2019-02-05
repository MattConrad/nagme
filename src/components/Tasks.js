import React, { Component } from 'react';


//hookify this eventually, should be doable
class Tasks extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            tasks: ['task 1', 'task 2']
        };
        
    }

    render() {
        return (
            <div>
                THESE ARE TASKS
                <ul>
                    {this.state.tasks.map(t => <li>{t}</li>)}
                </ul>
            </div>
        );
    }

}

export default Tasks;

