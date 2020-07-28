import * as convert from '../convert'

export function _deleteRun(bodyDoc, paraIndex, runIndex){
  var para = bodyDoc.pts[paraIndex]
  para.runs.splice(runIndex, 1)
}

export function _deleteRunImage(bodyDoc, paraIndex, runIndex){
  var para = bodyDoc.pts[paraIndex]
  para.runs.splice(runIndex, 1)
}

export function _deleteRunText(bodyDoc, paraIndex, runIndex, startIndex){
  var para = bodyDoc.pts[paraIndex]
  var run = para.runs[runIndex]
  var leftText = run.text.substr(0, startIndex)
  var rightText = run.text.substr(startIndex+1)

  run.text = leftText + rightText
}

export function _addRunTextAfter(bodyDoc, paraIndex, runIndex, text, textStyle){
  let r = {
      type: 'text',
      text: text,
      textStyle: textStyle,
  }

  bodyDoc.pts[paraIndex].runs.splice(runIndex, 0, r)
}

export function _addRunImageAfter(bodyDoc, paraIndex, runIndex, image, imageStyle){
  let r = {
      type: 'image',
      image: image,
      imageStyle: imageStyle,
  }

  bodyDoc.pts[paraIndex].runs.splice(runIndex, 0, r)
}

export function _spliceRunText(bodyDoc, paraIndex, runIndex, startIndex, text, textStyle){
  let run = bodyDoc.pts[paraIndex].runs[runIndex]
  let leftText = run.text.substr(0, startIndex)
  let rightText = run.text.substr(startIndex)
  let oldTextStyle = run.textStyle
  let textStyleEqual = textStyle ? convert.isTextStyleEqual(oldTextStyle, textStyle) : false
  
  if(textStyle){
      if(textStyleEqual){
          run.text = leftText + text + rightText

          return false
      }else{
          run.text = leftText

          let newRun = {
              type: 'text',
              text: text,
              textStyle: textStyle,
          }
          bodyDoc.pts[paraIndex].runs.splice(runIndex+1, 0, newRun)

          if(rightText){
              let rightRun = {
                  type: 'text',
                  text: rightText,
                  textStyle: oldTextStyle,
              }
              bodyDoc.pts[paraIndex].runs.splice(runIndex+2, 0, rightRun)
          }

          return true
      }
  }else{
      run.text = leftText + text + rightText

      return false
  }
}

export function _splitRunText(bodyDoc, paraIndex, runIndex, startIndex, endIndex){
  let run = bodyDoc.pts[paraIndex].runs[runIndex]
  if(startIndex == 0){
      startIndex = endIndex+1
      endIndex = run.text.length - 1
  }
  let leftText = run.text.substring(0, startIndex)
  let midText = run.text.substring(startIndex, endIndex+1)
  let rightText = run.text.substr(endIndex+1)
  let oldTextStyle = run.textStyle
  
  run.text = leftText

  if(midText){
      let newMidRun = {
          type: 'text',
          text: midText,
          textStyle: oldTextStyle,
          startIndex: 0,
      }
      bodyDoc.pts[paraIndex].runs.splice(runIndex+1, 0, newMidRun)
  }

  if(rightText){
      let rightRun = {
          type: 'text',
          text: rightText,
          textStyle: oldTextStyle,
          startIndex: 0,
      }
      bodyDoc.pts[paraIndex].runs.splice(runIndex+2, 0, rightRun)
  }

  return midText || rightText
}

export function _spliceRunImage(bodyDoc, paraIndex, runIndex, startIndex, image, imageStyle){
  let run = bodyDoc.pts[paraIndex].runs[runIndex]
  let leftText = run.text.substr(0, startIndex)
  let rightText = run.text.substr(startIndex)
  let oldTextStyle = run.textStyle
  
  run.text = leftText

  let newRun = {
      type: 'image',
      image: image,
      imageStyle: imageStyle,
  }
  bodyDoc.pts[paraIndex].runs.splice(runIndex+1, 0, newRun)

  if(rightText){
      let rightRun = {
          type: 'text',
          text: rightText,
          textStyle: oldTextStyle,
      }
      bodyDoc.pts[paraIndex].runs.splice(runIndex+2, 0, rightRun)
  }
}

export function _updateRunImageStyle(bodyDoc, paraIndex, runIndex, imageStyle){
  let run = bodyDoc.pts[paraIndex].runs[runIndex]
  run.imageStyle = imageStyle
}

