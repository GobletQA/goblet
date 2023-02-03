


export const styles ={
  hr: {
    marginTop: 6,
    // borderTop: `2px solid ${blue[400]}`,
    pointerEvents: 'none',
  },
  dropContainer: {
    height: 12,
    width: 'calc(100% + 40px)',
    marginLeft: -40,
  },
  dragContainer: {
    borderRadius: 8,
    padding: '4px 8px 4px 20px',
    display: 'flex',
    flexFlow: 'row nowrap',
    marginLeft: -40,
    position: 'relative',
    cursor: `pointer`,
  },
  dragButton: {
    marginLeft: -20,
    // color: grey[500],
    cursor: 'grab',
  },
  dragContainerHover: {
    // backgroundColor: grey[50],
    '& li': {
      listStyleType: 'none !important',
    },
  },
  dragContainerHold: {
    // backgroundColor: blue[10],
    cursor: 'grabbing !important',
    '& li': {
      listStyleType: 'none !important',
      cursor: 'grabbing !important',
    },
  },
})
