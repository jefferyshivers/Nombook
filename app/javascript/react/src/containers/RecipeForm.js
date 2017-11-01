import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { 
  Editor, 
  EditorState,
  convertToRaw } from 'draft-js';
import { Link } from 'react-router-dom';

import { changeMetaField, changeStep, addAStep, clearForm } from '../actions/editor';
import { Nombook as NB } from '../api';
import '../styles/containers/Recipe_RecipeForm.css';

class RecipeForm extends Component {
  constructor(props) {
    super(props)
    this.handleChangeMetaField = this.handleChangeMetaField.bind(this)
    this.handleChangeStep = this.handleChangeStep.bind(this)
    this.handleSaveRecipe = this.handleSaveRecipe.bind(this)
    this.handleClearForm = this.handleClearForm.bind(this)
  }

  handleChangeMetaField(field, editorState) {
    this.props.onChangeMetaField(field, editorState)
  }

  handleChangeStep(index_in_recipe, editorState) {
    this.props.onChangeStep(index_in_recipe, editorState)
  }

  handleSaveRecipe() {
    const nb = new NB();

    let body = {
      name: JSON.stringify(convertToRaw(this.props.editor.name.getCurrentContent())),
      description: JSON.stringify(convertToRaw(this.props.editor.description.getCurrentContent())),
      ingredients_body: JSON.stringify(convertToRaw(this.props.editor.ingredients_body.getCurrentContent()))
    }

    let params = {
      method: 'POST',
      body: JSON.stringify(body)
    }

    nb.request(params, `/users/${this.props.current_user.id}/recipes`, res => {
      if (res.saved) {
        this.props.history.push(res.location);
        this.props.onClearForm();
      }
    })
  }

  handleClearForm() {
    this.props.onClearForm();
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

    {/* control panel */}
    const control_panel = (
      <div className="control-panel">
        <div className="style-button-group"></div>
        <div className="meta-button-group">
          <div 
            className="button" 
            id="save"
            onClick={this.handleSaveRecipe}>
            Save
          </div>
          <div 
            className="button" 
            id="clear"
            onClick={this.handleClearForm}>
            Clear
          </div>
        </div>
      </div>
    )

    {/* meta card */}
    const meta = (
      <div className="meta">

        {/* name */}
        <div className="name">
          <Editor 
            spellCheck={true}
            editorState={this.props.editor.name} 
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
            editorState={this.props.editor.description} 
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
            editorState={this.props.editor.ingredients_body} 
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
              editorState={step.body} 
              onChange={(e) => {this.handleChangeStep(step.index_in_recipe, e)}} />
          </div>
        </div>
      )
    })
    const add_a_step_button = (
      <div className="add-a-step-button-container">
        <div className="add-a-step-button" onClick={() => {this.props.onAddAStep()}}>
          Add a step
        </div>
      </div>
    )
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
        {control_panel}
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
    }
  }
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeForm));
