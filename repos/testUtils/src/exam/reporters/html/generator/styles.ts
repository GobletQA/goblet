import type { TExEventData } from "@gobletqa/exam"
import {
  font,
  colors,
  margin,
  padding,
} from './theme'


const partialStyles = `
  section.test-section {
    margin-top: ${margin.dpx};
  }

  section.test-section .test-location-container {
    opacity: 0.7;
    display: flex;
    font-size: 18px;
    cursor: pointer;
    align-items: center;
    margin-bottom: ${margin.px};
    padding: ${padding.hpx} ${padding.px} 8px;
  }
  
  section.test-section .test-location-container.failed {
    ${colors.background.failed}
  }

  section.test-section .test-location-container.passed {
    ${colors.background.passed}
  }

  section.test-section .test-location-container.skipped {
    ${colors.background.skipped}
  }

  section.test-section .test-location-container:hover {
    opacity: 1;
  }

  section.test-section .test-location-container.open {
    opacity: 1;
  }

  section.test-section .root-list {
    overflow: hidden;
    padding-left: ${padding.px};
    transition: max-height 300ms ease;
  }

  section.test-section .location-icon-container {
    margin-right: ${margin.hpx};
  }

  section.test-section .location-icon-container {
    left: -5px;
    position: relative;
    margin-right: ${margin.hpx};
  }

`
const overviewStyles = `
  .overview-container  {
    margin-bottom: ${margin.dpx};
  }

  .overview-card {
    padding: ${padding.hpx};
    background-color: ${colors.w00};
  }
  
  .overview-card h4 {
    margin: 0px;
    font-size: 14px;
    margin-bottom: ${margin.hpx};
  }

  .overview-container .overview-sections {
    display: flex;
  }
  .overview-container .overview-section {
    flex-basis: 15%;
    min-width: 125px;
    margin-right: ${margin.px};
  }
  
  .overview-container .overview-section .overview-text {
    font-size: 12px;
    padding: ${padding.qpx};
    padding-left: ${padding.hpx};
    margin-left: ${margin.hpx};
    margin-bottom: ${margin.qpx};
  }
  
  .overview-container .overview-text.overview-passed {
    color: ${colors.pass};
    border-left: 5px solid ${colors.pass};
  }

  .overview-container .overview-text.overview-failed {
    color: ${colors.fail};
    font-weight: bold;
    border-left: 5px solid ${colors.fail};
  }

  .overview-container .overview-text.overview-skipped {
    color: ${colors.skip};
    border-left: 5px solid ${colors.skip};
  }
`

const testStyles = `
  .list-parent {
    padding-left: ${padding.px};
  }

  .root-list.list-parent {
    padding-left: 0px;
  }

  .root-list .list-item .item-title {
    padding: ${padding.qpx} 0px;
  }
  
  .root-list .list-item.step-skipped {
    opacity: 0.5;
  }

  .root-list .title-keyword {
    padding-right: ${padding.qpx};
    font-weight: bold;
  }
  .root-list .feature-keyword {
    color: ${colors.primary};
  }
  .root-list .scenario-keyword {
    color: ${colors.secondary};
  }

  .root-list .step-keyword {
    color: ${colors.c10};
  }

  .root-list .title-description {
    color: ${colors.c16};
  }
  
  .root-list .feature-list {
    padding-left: ${padding.px};
  }
  
  .root-list .scenario-list {
    padding-left: 0px;
  }

  .root-list .failed-list {
    overflow: hidden;
    padding: 0px ${padding.dpx};
    transition: max-height 300ms ease;
  }

  .root-list .failed-list .failed-description {
    display: flex;
    margin-top: 0px;
    border-radius: 5px;
    flex-direction: column;
    color: ${colors.c21};
    padding: ${padding.px};
    margin-bottom: ${margin.qpx};
  }
  
  .root-list .failed-list .failed-description-header {
    color: ${colors.fail};
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .root-list .failed-list .failed-description-text {
    font-size: 14px;
    color: ${colors.c21};
    margin-left: ${margin.px};
  }

  .root-list .failed-list .test-image-container {
    width: 100%;
    text-align: center;
    margin-top: ${margin.dpx};
  }
  .root-list .failed-list .test-image {
    width: 80%;
    border: 1px solid ${colors.c03};
  }

  .root-list .step-item {
    width: 100%;
    margin-bottom: ${margin.qpx};
  }

  .root-list .step-item .step-description {
    display: flex;
    align-items: center;
    padding: ${padding.hpx} ${padding.px} 7px;
    justify-content: space-between;
  }

  .root-list .step-item .step-description.failed {
    cursor: pointer;
  }

  
  .root-list .step-item .step-description .step-icon-container {
    margin-right: ${margin.hpx};
    height: 23px;
  }
  
  .root-list .step-item .step-description .step-time {
    margin-left: auto;
  }

`

export const Styles = (includePartial:boolean) => {
  return `
    <style>
      button,hr,input{overflow:visible}progress,sub,sup{vertical-align:baseline}[type=checkbox],[type=radio],legend{box-sizing:border-box;padding:0}html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}details,main{display:block}h1{font-size:2em;margin:.67em 0}hr{box-sizing:content-box;height:0}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}a{background-color:transparent}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:bolder}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}img{border-style:none}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:ButtonText dotted 1px}fieldset{padding:.35em .75em .625em}legend{color:inherit;display:table;max-width:100%;white-space:normal}textarea{overflow:auto}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}[hidden],template{display:none}


      body {
        margin: ${margin.dpx};
        margin-top: ${margin.px};
        color: ${colors.c21};
        font-family: ${font.family};
      }

      ul {
        list-style-type: none;
        margin: 0px;
        padding: 0px;
      }
      
      svg.status-icon {
        height: 20px;
        width: 20px;
      }


      ${overviewStyles}
      ${testStyles}
      ${includePartial ? partialStyles : ``}

    </style>
  `
}
