import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { 
  Editor, 
  EditorState,
  convertFromRaw,
  convertToRaw } from 'draft-js';
import { Link } from 'react-router-dom';

import { changeMetaField, changeStep, addAStep, clearForm, fork } from '../actions/editor';
import { Nombook as NB } from '../api';
import '../styles/containers/Recipe_RecipeForm.css';

class Recipe extends Component {
  constructor(props) {
    super(props)
    this.handleChangeMetaField = this.handleChangeMetaField.bind(this)
    this.handleChangeStep = this.handleChangeStep.bind(this)
    this.handleSaveRecipe = this.handleSaveRecipe.bind(this)
    this.handleClearForm = this.handleClearForm.bind(this)
    this.handleFork = this.handleFork.bind(this)
    this.state = {
      editing: false,
      recipe: {
        name: EditorState.createEmpty(),
        description: EditorState.createEmpty(),
        ingredients_body: EditorState.createEmpty()
      }
    }
  }

  componentWillMount() {
    const nb = new NB();

    nb.request('GET', `/recipes/${this.props.match.params.id}`, res => {
      if (res.recipe) {
        let recipe = Object.assign({}, res.recipe, {
          name: EditorState.createWithContent(convertFromRaw(JSON.parse(res.recipe.name))),
          description: EditorState.createWithContent(convertFromRaw(JSON.parse(res.recipe.description))),
          ingredients_body: EditorState.createWithContent(convertFromRaw(JSON.parse(res.recipe.ingredients_body)))
        })
        this.setState({recipe: recipe})
      } else { 
        console.log('Something went wrong while trying to load this recipe.') 
      }
    })
  }

  handleForkRecipe() {
    // this.props.onChangeMetaField(field, editorState)
  }

  handleChangeMetaField(field, editorState) {
    // this.props.onChangeMetaField(field, editorState)
  }

  handleChangeStep(index_in_recipe, editorState) {
    // this.props.onChangeStep(index_in_recipe, editorState)
  }

  handleSaveRecipe() {
    // const nb = new NB();

    // let body = {
    //   name: JSON.stringify(convertToRaw(this.state.editor.name.getCurrentContent())),
    //   description: JSON.stringify(convertToRaw(this.state.editor.description.getCurrentContent())),
    //   ingredients_body: JSON.stringify(convertToRaw(this.state.editor.ingredients_body.getCurrentContent()))
    // }

    // let params = {
    //   method: 'POST',
    //   body: JSON.stringify(body)
    // }

    // nb.request(params, `/users/${this.props.current_user.id}/recipes`, res => {
    //   if (res.saved) {
    //     this.props.history.push(res.location);
    //     this.props.onClearForm();
    //   }
    // })
  }

  handleClearForm() {
    this.props.onClearForm();
  }

  handleFork() {
    this.props.history.push("/recipes/new");
    let params = {
      id: this.state.recipe.id,
      name: this.state.recipe.name,
      ingredients_body: this.state.recipe.ingredients_body
    }

    this.props.onFork(params);
  }

  render() {
    const forked_from_id = this.props.editor.forked_from_recipe
    let forked_from_message = (forked_from_id) ? (
      <div className="forked-from">
        <div className="forked-from-button">
          Forked from {forked_from_id}
        </div>
      </div>
    ) : null


    {/* edit or fork button */}
    const edit_or_fork_button = (this.state.recipe.user_id !== this.props.current_user.id) ? (
      <div className="edit-or-fork-button-container">
        <div className="button" id="edit" onClick={() => {this.setState({editing: true})}}>
          edit
        </div>
      </div>
    ) : (
      <div className="edit-or-fork-button-container">
        <div className="button" id="like">
          <i className="material-icons">favorite_border</i>
          {" like"}
        </div>
        <div className="button" id="fork" onClick={this.handleFork}>
          <i className="material-icons">call_split</i>
          {" fork"}
        </div>
      </div>
    )

    {/* control panel */}
    const control_panel = (
      <div className="control-panel">
        <div className="style-button-group"></div>
        <div className="meta-button-group">
          <div 
            className="button" 
            id="save"
            onClick={this.handleSaveRecipe}
            title="save form">
            Save
          </div>
          <div 
            className="button" 
            id="cancel"
            onClick={() => this.setState({editing: false})}
            title="cancel edits">
            Cancel
          </div>
        </div>
      </div>
    )
    {/* edit/fork button or control panel */}
    const edit_fork_button_or_control_panel = (this.state.editing) ? control_panel : edit_or_fork_button

    {/* meta card */}
    const meta = (
      <div className="meta">

        {/* name */}
        <div className="name">
          <Editor 
            spellCheck={true}
            readOnly={!this.state.editing}
            editorState={this.state.recipe.name} 
            onChange={(e) => {this.handleChangeMetaField("name", e)}} />
        </div>

        {/* author */}
        <div className="author">
          {"by "}
          <Link to={`/users/${this.props.current_user.username}`}>
            {this.props.current_user.username}
          </Link>
        </div>

        {forked_from_message}
        
        {/* description */}
        <div className="description">
          <Editor 
            spellCheck={true}
            readOnly={!this.state.editing}
            editorState={this.state.recipe.description} 
            onChange={(e) => {this.handleChangeMetaField("description", e)}} />
        </div>
      </div>
    )

    {/* ingredients card */}
    const ingredients = (
      <div className="ingredients">
        <div className='label'>
          Ingredients
        </div>
        <div className="ingredients-body">
          <Editor 
            spellCheck={true}
            readOnly={!this.state.editing}
            editorState={this.state.recipe.ingredients_body} 
            onChange={(e) => {this.handleChangeMetaField("ingredients_body", e)}} />
        </div>
      </div>
    )

    {/* steps card */}
    const steps = this.props.editor.steps.map(step => {
      return(
        <div className="step-container" key={step.index_in_recipe}>
          
          <div className="step-index">{step.index_in_recipe + 1}</div>
          
          <div className="step">
            <Editor 
              spellCheck={true}
              readOnly={!this.state.editing}
              editorState={step.body} 
              onChange={(e) => {this.handleChangeStep(step.index_in_recipe, e)}} />
          </div>
        </div>
      )
    })
    const add_a_step_button = (this.state.editing) ? (
      <div className="add-a-step-button-container">
        <div className="add-a-step-button" onClick={() => {this.props.onAddAStep()}}>
          Add a step
        </div>
      </div>
    ) : null
    const method = (
      <div className='method'>
        <div className='label'>
          Method
        </div>
        {steps}
        {add_a_step_button}
      </div>
    )

    return(
      <div className='Recipe'>
        {edit_fork_button_or_control_panel}
        {meta}
        {ingredients}
        {method}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    editor: state.editor,
    current_user: state.current_user
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeMetaField: (field, editorState) => {
      dispatch(changeMetaField(field, editorState))
    },
    onChangeStep: (index_in_recipe, editorState) => {
      dispatch(changeStep(index_in_recipe, editorState))
    },
    onAddAStep: () => {
      dispatch(addAStep())
    },
    onClearForm: () => {
      dispatch(clearForm())
    },
    onFork: (params) => {
      dispatch(fork(params))
    }
  }
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Recipe));
