import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { 
  Editor, 
  RichUtils,
  EditorState,
  convertToRaw } from 'draft-js';
import { Link } from 'react-router-dom';

import ReactFileReader from 'react-file-reader';
import { changeMetaField, changeStep, addAStep, deleteStep, clearForm } from '../actions/editor';
import { Nombook as NB } from '../api';
import '../styles/containers/Recipe_RecipeForm.scss';

class RecipeForm extends Component {
  constructor(props) {
    super(props)
    this.handleChangeMetaField = this.handleChangeMetaField.bind(this)
    this.handleChangeStep = this.handleChangeStep.bind(this)
    this.handleSaveRecipe = this.handleSaveRecipe.bind(this)
    this.handleClearForm = this.handleClearForm.bind(this)
    this.mountPhoto = this.mountPhoto.bind(this)
    this.state = {
      photo_64: null,
      selected_field: null
    }
    this._onBoldClick = this._onBoldClick.bind(this)
    this._onItalicClick = this._onItalicClick.bind(this)
    this._onUnderlineClick = this._onUnderlineClick.bind(this)
    this.focusMetaField = this.focusMetaField.bind(this)
    this.focusStep = this.focusStep.bind(this)
  }

  _onBoldClick() {
    if (this.state.selected_field) {
      let arg = this.state.selected_field.arg
      if (this.state.selected_field.type === 'META_FIELD') {
        this.props.onChangeMetaField(arg, RichUtils.toggleInlineStyle(this.props.editor[arg], 'BOLD'))
      } else {
        this.props.onChangeStep(arg, RichUtils.toggleInlineStyle(this.props.editor.steps[arg].body, 'BOLD'))
      }
    }
  }
  _onItalicClick() {
    if (this.state.selected_field) {
      let arg = this.state.selected_field.arg
      if (this.state.selected_field.type === 'META_FIELD') {
        this.props.onChangeMetaField(arg, RichUtils.toggleInlineStyle(this.props.editor[arg], 'ITALIC'))
      } else {
        this.props.onChangeStep(arg, RichUtils.toggleInlineStyle(this.props.editor.steps[arg].body, 'ITALIC'))
      }
    }
  }
  _onUnderlineClick() {
    if (this.state.selected_field) {
      let arg = this.state.selected_field.arg
      if (this.state.selected_field.type === 'META_FIELD') {
        this.props.onChangeMetaField(arg, RichUtils.toggleInlineStyle(this.props.editor[arg], 'UNDERLINE'))
      } else {
        this.props.onChangeStep(arg, RichUtils.toggleInlineStyle(this.props.editor.steps[arg].body, 'UNDERLINE'))
      }
    }
  }

  _toggleBlockType(blockType) {
    if (this.state.selected_field) {
      let arg = this.state.selected_field.arg
      if (this.state.selected_field.type === 'META_FIELD') {
        this.props.onChangeMetaField(arg, RichUtils.toggleBlockType(this.props.editor[arg], blockType))
      } else {
        this.props.onChangeStep(arg, RichUtils.toggleBlockType(this.props.editor.steps[arg].body, blockType))
      }
    }
  }

  focusMetaField(field) {
    this.setState({selected_field: {type: 'META_FIELD', arg: field}})
  }

  focusStep(index) {
    this.setState({selected_field: {type: 'STEP', arg: index}})
  }

  handleChangeMetaField(field, editorState) {
    this.props.onChangeMetaField(field, editorState)
  }

  handleChangeStep(index_in_recipe, editorState) {
    this.props.onChangeStep(index_in_recipe, editorState)
  }

  handleSaveRecipe() {
    const nb = new NB();

    let steps = this.props.editor.steps.map(step => {
      return {
        index_in_recipe: step.index_in_recipe,
        body: JSON.stringify(convertToRaw(step.body.getCurrentContent()))
      }
    })
    let body = {
      name: JSON.stringify(convertToRaw(this.props.editor.name.getCurrentContent())),
      description: JSON.stringify(convertToRaw(this.props.editor.description.getCurrentContent())),
      ingredients_body: JSON.stringify(convertToRaw(this.props.editor.ingredients_body.getCurrentContent())),
      steps: steps
    }

    let forked_from_id = this.props.editor.forked_from_recipe_id
    if (forked_from_id) {
      body.forked_from_id = forked_from_id
    }

    let photo = this.state.photo_64
    if (photo) {
      body.photo = photo
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

  mountPhoto(file) {
    this.setState({
      photo_64: file.base64
    })
    // console.log(file.base64)
  }

  render() {

    {/* forked from message */}
    const forked_from_name = this.props.editor.forked_from_recipe_name
    let forked_from_message = (forked_from_name) ? (
      <div className="forked-from">
        <div 
          className="forked-from-button"
          onClick={() => {
            this.props.history.push(`/recipes/${this.props.editor.forked_from_recipe_id}`);
          }}>
          <div className="label">Forked from</div>
          <Editor 
            readOnly={true}
            editorState={forked_from_name} 
            onChange={() => {}} />
        </div>
      </div>
    ) : null

    {/* control panel */}
    const control_panel = (
      <div className="control-panel">
        <div className="style-button-group">
          <div className="button" onClick={this._onBoldClick}> <i className="material-icons">format_bold</i> </div>
          <div className="button" onClick={this._onItalicClick}> <i className="material-icons">format_italic</i> </div>
          <div className="button" onClick={this._onUnderlineClick}> <i className="material-icons">format_underline</i> </div>
          <div className="button" onClick={() => {this._toggleBlockType('unordered-list-item')}}> <i className="material-icons">format_list_bulleted</i> </div>
          <div className="button" onClick={() => {this._toggleBlockType('ordered-list-item')}}> <i className="material-icons">format_list_numbered</i> </div>
          <div className="button" onClick={() => {this._toggleBlockType('code-block')}}> <i className="material-icons">code</i> </div>
          <div className="button" onClick={() => {this._toggleBlockType('blockquote')}}> <i className="material-icons">format_quote</i> </div>
        </div>
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

    const background = (this.state.photo_64) ? {
      backgroundImage: `url(${this.state.photo_64})`,
      backgroundSize: 'cover'
    } : null
    const photo = (this.state.photo_64) ? (
      <div className="photo" style={background}></div>
    ) : null
    const preview_image = (
      <div className="photo-container">
        {photo}
        <ReactFileReader 
          fileTypes={[".png",".jpg",".jpeg",".gif"]} 
          base64={true} multipleFiles={false} 
          handleFiles={this.mountPhoto}>
          <button className='upload-photo-button'>
            {(this.state.photo_64) ? "Change Photo" : "Upload Photo"}
          </button>
        </ReactFileReader>
      </div>
    )

    {/* meta card */}
    const meta = (
      <div className="meta">

        {/* name */}
        <div className="name editing">
          <Editor 
            onFocus={() => {this.focusMetaField("name")}}
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

        {preview_image}
        
        {/* description */}
        <div className="description editing">
          <Editor 
            onFocus={() => {this.focusMetaField("description")}}
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
        <div className="ingredients-body editing">
          <Editor 
            onFocus={() => {this.focusMetaField("ingredients_body")}}
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
          
          <div className="step-index-container">
            <div className="step-index-number">
              {step.index_in_recipe + 1}
            </div>
            <div className="step-index-delete">
              <i 
                className="material-icons" 
                onClick={() => {this.props.onDeleteStep(step.index_in_recipe)}}>
                delete
              </i>
            </div>
          </div>
          
          <div className="step editing">
            <Editor 
              spellCheck={true}
              onFocus={() => {this.focusStep(step.index_in_recipe)}}
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
    onDeleteStep: (index_in_recipe) => {
      dispatch(deleteStep(index_in_recipe))
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
