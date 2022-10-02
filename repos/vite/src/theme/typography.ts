import { CSSProperties } from 'react'

export const typography = {
  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
  fontSize: 14,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  h5: {
    fontSize: "7rem",
    fontWeight: 300,
    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
    letterSpacing: "-.04em",
    lineHeight: "1.14286em",
    marginLeft: "-.04em",
    color: "rgba(0, 0, 0, 0.54)"
  },
  h4: {
    fontSize: "3.5rem",
    fontWeight: 400,
    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
    letterSpacing: "-.02em",
    lineHeight: "1.30357em",
    marginLeft: "-.02em",
    color: "rgba(0, 0, 0, 0.54)"
  },
  h3: {
    fontSize: "2.8125rem",
    fontWeight: 400,
    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
    lineHeight: "1.06667em",
    marginLeft: "-.02em",
    color: "rgba(0, 0, 0, 0.54)"
  },
  h2: {
    fontSize: "2.125rem",
    fontWeight: 400,
    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
    lineHeight: "1.20588em",
    color: "rgba(0, 0, 0, 0.54)"
  },
  h1: {
    fontSize: "1.5rem",
    fontWeight: 400,
    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
    lineHeight: "1.35417em",
    color: "rgba(0, 0, 0, 0.87)"
  },
  subtitle1: {
    fontSize: "1rem",
    fontWeight: 400,
    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
    lineHeight: "1.5em",
    color: "rgba(0, 0, 0, 0.87)"
  },
  body2: {
    fontSize: "0.875rem",
    fontWeight: 500,
    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
    lineHeight: "1.71429em",
    color: "rgba(0, 0, 0, 0.87)"
  },
  body1: {
    fontSize: "0.875rem",
    fontWeight: 400,
    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
    lineHeight: "1.46429em",
    color: "rgba(0, 0, 0, 0.87)"
  },
  caption: {
    fontSize: "0.75rem",
    fontWeight: 400,
    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
    lineHeight: "1.375em",
    color: "rgba(0, 0, 0, 0.54)"
  },
  button: {
    fontSize: "0.875rem",
    textTransform: "uppercase" as CSSProperties['textTransform'],
    fontWeight: 500,
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    color: "rgba(0, 0, 0, 0.87)"
  }
}