import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import Pdf from 'react-native-pdf';
import { BaseUrlImages } from '../../utils/BaseUrlImages';

const PdfComponent = ({route}) => {
    const pdf = route?.params?.pdf
    const pdfLink = pdf == null ?  BaseUrlImages : BaseUrlImages+pdf
    const source = pdf == null ? { uri: BaseUrlImages, cache: true } : { uri: pdfLink, cache: true };
    return (
        <View style={styles.container}>
                {pdf!=undefined && pdf!=null && <Pdf
                trustAllCerts={false}
                    source={pdf && source}
                    onLoadComplete={(numberOfPages,filePath) => {
                        console.log(`Number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages) => {
                        console.log(`Current page: ${page}`);
                    }}
                    onError={(error) => {
                        console.log(error);
                    }}
                    onPressLink={(uri) => {

                       console.log(`Link pressed: ${uri}`);
                    }}
                    style={styles.pdf}/>}
            </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    }
});

export default PdfComponent;
