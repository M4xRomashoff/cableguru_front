import React, { useState, useEffect } from 'react';
import '../Home/Home.css';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    flexGrow: 0,
  },

  sectionHeader: {
    margin: 10,
    padding: 10,
    flexGrow: 0,
    flexDirection: 'row',
    backgroundColor: '#b3b1b1',
    border: 1,
    textAlign: 'left',
  },
  sectionSplice: {
    marginLeft: 10,
    padding: 0,
    flexGrow: 0,
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  sectionTable: {
    margin: 10,
    padding: 1,
    flexGrow: 2,
    flexDirection: 'row',
  },
  section1: {
    maxWidth: 150,
    flex: 1,
    padding: 10,
    fontWeight: 'normal',
    fontSize: 25,
    color: 'blue',
  },
  section12: {
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
    maxWidth: 500,
    flex: 1,
    padding: 10,
    textAlign: 'left',
    fontWeight: 'normal',
    fontSize: 14,
    color: 'black',
    backgroundColor: '#dbd3d3',
  },
  section2: {
    padding: 1,
    textAlign: 'center',
    fontWeight: 'lighter',
    fontSize: 10,
    border: 1,
    color: 'black',
  },
  section3: {
    padding: 1,
    textAlign: 'center',
    fontWeight: 'lighter',
    fontSize: 10,
    color: 'black',
    border: 1,
    backgroundColor: '#dbd3d3',
  },
});

function MyDocument({ item, spliceData }) {
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
    MainHeader0 = ['ID : ', item.id, '\n'];
    MainHeader1 = ['Manufacturer : ', '\n Model : ', '\nSize :', '\n Connector : ', '\n Owner : ', '\n Address : ', '\n Access :', '\n Latitude :', '\n Longitude :', '\n Build Date : '];
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
    MainHeader0 = ['ID : ', item.id, '\n'];
    MainHeader1 = ['Manufacturer : ', '\n Model : ', '\nSize :', '\n Splice Type : ', '\n Owner : ', '\n Address : ', '\n Mount :', '\n Latitude :', '\n Longitude :', '\n Build Date : '];
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
          <View style={styles.sectionHeader} key={keyGen()}>
            <View style={styles.section1} key={keyGen()}>
              <Text>{MainHeader0}</Text>
            </View>
            <View style={styles.section12} key={keyGen()}>
              <Text>{MainHeader1}</Text>
            </View>
            <View style={styles.section13} key={keyGen()}>
              <Text>{MainHeader2}</Text>
            </View>
          </View>
          <View style={styles.sectionSplice} key={keyGen()}>
            {splBody1.map((option) => (
              <View style={styles.section2} key={keyGen()}>
                <Text>{option}</Text>
              </View>
            ))}
          </View>
          <View style={styles.sectionSplice} key={keyGen()}>
            {splBody2.map((option) => (
              <View style={styles.section3} key={keyGen()}>
                <Text>{option}</Text>
              </View>
            ))}
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
