import React, { useState, useEffect } from 'react';
import '../Home/Home.css';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: "Roboto",
  src:
    "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf"
});

const styles = StyleSheet.create({
  myText : {
    fontFamily : "Roboto"
  },
  rowView: {
    display: 'flex',
    flexDirection: 'column',
    border: '3px solid #b3b1b1',
    // borderBottom: '3px solid #b3b1b1',
    paddingTop: 8,
    paddingBottom: 8,
    marginLeft: 8,
    marginRight:8,
    textAlign: "center"
  },
  rowView1: {
    fontFamily : "Roboto",
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 0,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    textAlign: "left",
    fontWeight: 'normal',
    fontSize: 12,
  },
  rowView2: {
    borderBottom: '1px solid #b3b1b1',
    fontFamily : "Roboto",
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 0,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    textAlign: "left",
    fontWeight: 'normal',
    fontSize: 12,
  },

  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    flexGrow: 0,
  },

  sectionHeader: {
    fontFamily : "Roboto",
    margin: 10,
    padding: 10,
    flexGrow: 0,
    flexDirection: 'row',
    backgroundColor: '#b3b1b1',
    border: 1,
    textAlign: 'left',

  },
  sectionSplice: {
    fontFamily : "Roboto",
    marginLeft: 10,
    padding: 0,
    flexGrow: 0,
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  sectionTable: {
    fontFamily : "Roboto",
    margin: 10,
    padding: 1,
    flexGrow: 2,
    flexDirection: 'row',
  },
  section1: {
    fontFamily : "Roboto",
    maxWidth: 150,
    flex: 1,
    padding: 10,
    fontWeight: 'normal',
    fontSize: 25,
    color: 'blue',
  },
  section12: {
    fontFamily : "Roboto",
    maxWidth: 150,
    flex: 1,
    padding: 10,
    textAlign: 'left',
    fontWeight: 'normal',
    fontSize: 14,
    color: 'black',
    backgroundColor: '#dbd3d3',
  },
  section13: {
    fontFamily : "Roboto",
    maxWidth: 500,
    flex: 1,
    padding: 10,
    textAlign: 'left',
    fontWeight: 'normal',
    fontSize: 14,
    color: 'black',
    backgroundColor: '#dbd3d3',
  },

});

function MyDocument({ l, item, spliceData }) {
  let MainHeader0 = [];
  let MainHeader1 = [];
  let MainHeader2 = [];
  let splBody1 = [];
  let splBody2 = [];
  let size = 0;
  if (spliceData.header.length) {
    size = spliceData.header[0].length;
    for (let i = 0; i < size; i++) {
      splBody1.push(['                      \n']);
      splBody2.push(['                      \n']);
    }

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < 7; j++) {
        splBody1[i].push(spliceData.header[j][i] + '\n');
      }
    }
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < spliceData.body.length; j++) {
        splBody2[i].push(spliceData.body[j][i] + '\n');
      }
    }
  }

  if (item.connector) {
    MainHeader0 = [l.id+' : ', item.id, '\n'];
    MainHeader1 = [l.Manufacturer +' : ', '\n '+ l.Model +' : ', '\n '+l.Size+' :', '\n '+l.Connector+' : ', '\n '+l.Owner+' : ', '\n '+l.Address+' : ', '\n '+l.Access+' :', '\n '+l.Latitude +' :', '\n'+l. Longitude+' :', '\n '+l.Build_Date+' : '];
    MainHeader2 = [
      item.mfg,
      '\n',
      item.model,
      '\n',
      item.capacity,
      '\n',
      item.connector,
      '\n',
      item.owner,
      '\n',
      item.address,
      '\n',
      item.access,
      '\n',
      item.latitude,
      '\n',
      item.longitude,
      '\n',
      item.birthday,
    ];
  }

  if (item.spl_type) {
    MainHeader0 = [l.id+' : ', item.id, '\n'];
    MainHeader1 = [l.Manufacturer +' : ', '\n '+ l.Model +' : ', '\n '+l.Size+' :', '\n '+l.Splice_Type+' : ', '\n '+l.Owner+' : ', '\n '+l.Address+' : ', '\n '+l.Mount+' :', '\n '+l.Latitude +' :', '\n'+l. Longitude+' :', '\n '+l.Build_Date+' : '];
    MainHeader2 = [
      item.mfg,
      '\n',
      item.model,
      '\n',
      item.capacity,
      '\n',
      item.spl_type,
      '\n',
      item.owner,
      '\n',
      item.address,
      '\n',
      item.mount,
      '\n',
      item.latitude,
      '\n',
      item.longitude,
      '\n',
      item.birthday,
    ];
  }

  function keyGen() {
    let number = Math.random();
    return number;
  }

  if (item) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.sectionHeader}>
            <View style={styles.section1} >
              <Text>{MainHeader0}</Text>
            </View>
            <View style={styles.section12}>
              <Text>{MainHeader1}</Text>
            </View>
            <View style={styles.section13}>
              <Text>{MainHeader2}</Text>
            </View>
          </View>
          <View style={styles.rowView} >
          <View style={styles.rowView2} >
            {splBody1.map((option) => (
              <View style={styles.rowView1}>
                <Text style={{
                  width: `${100 / splBody1.length}%`,
                }}>{option}</Text>
              </View>
            ))}
          </View>
          <View style={styles.rowView1} >
            {splBody2.map((option) => (
              <View  style={styles.rowView1} >
                <Text style={{
                 width: `${100 / splBody2.length}%`
                }}>{option}</Text>
              </View>
            ))}
          </View>
          </View>

        </Page>
      </Document>
    );
  } else {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section3}>
            <Text>empty page</Text>
          </View>
        </Page>
      </Document>
    );
  }
}
export default MyDocument;
