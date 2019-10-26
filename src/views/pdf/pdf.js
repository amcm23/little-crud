import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image
} from "@react-pdf/renderer";
import moment from "moment";

const POSTER_PATH = "https://image.tmdb.org/t/p/w154";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff"
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  movieContainer: {
    backgroundColor: "#f6f6f5",
    display: "flex",
    flexDirection: "row",
    padding: 5
  },
  movieDetails: {
    display: "flex",
    marginLeft: 5
  },
  movieTitle: {
    fontSize: 15,
    marginBottom: 10
  },
  movieOverview: {
    fontSize: 10
  },

  image: {
    height: 200,
    width: 150
  },
  subtitle: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    width: 150,
    alignItems: "center",
    marginBottom: 12
  },
  vote: {
    display: "flex",
    flexDirection: "row"
  },
  rating: {
    height: 10,
    width: 10
  },
  vote_text: {
    fontSize: 10
  },
  vote_pop: {
    fontSize: 10,
    padding: 2,
    backgroundColor: "#61C74F",
    color: "#fff"
  },
  vote_pop_text: {
    fontSize: 10,
    marginLeft: 4
  },
  overviewContainer: {
    minHeight: 110
  },
  detailsFooter: {
    display: "flex",
    flexDirection: "row"
  },
  lang: {
    fontSize: 8,
    fontWeight: 700
  },
  vote_average: {
    fontSize: 8,
    marginLeft: 4,
    fontWeight: "bold"
  }
});

export function PdfDocument(props) {
  console.log("pdf props", props.data);
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.movieContainer}>
          <View style={styles.movieDetails}>
            <Text style={styles.movieTitle}>Prueba factura</Text>
            <View style={styles.subtitle}>
              <View style={styles.vote}>
                <Text style={styles.vote_text}>Prueba factura</Text>
              </View>
              <View style={styles.vote}>
                <Text style={styles.vote_pop}>Prueba factura</Text>
                <Text style={styles.vote_pop_text}>Popularity</Text>
              </View>
            </View>
            <View style={styles.overviewContainer}>
              <Text style={styles.movieOverview}>Prueba factura</Text>
            </View>
            <View style={styles.detailsFooter}>
              <Text style={styles.lang}>Language: Prueba factura</Text>
              <Text style={styles.vote_average}>
                Average Votes: Prueba factura
              </Text>
              <Text style={styles.vote_average}>
                Release Date: Prueba factura
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
