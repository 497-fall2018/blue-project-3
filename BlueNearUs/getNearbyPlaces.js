import RNGooglePlaces from 'react-native-google-places';
import React, {Component} from 'react';

class GPlacesDemo extends Component {
    openSearchModal() {
        RNGooglePlaces.openPlacePickerModal()
            .then((place) => {
                console.log(place);
                // place represents user's selection from the
                // suggestions and it is a simplified Google Place object.
            })
            .catch(error => console.log(error.message));  // error is a Javascript Error object
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                style={styles.button}
                onPress={() => this.openSearchModal()}
                >
                <Text>Open Place Picker</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default GPlacesDemo;