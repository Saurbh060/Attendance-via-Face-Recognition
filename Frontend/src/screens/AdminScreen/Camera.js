import React, { Component } from 'react';
import {
    View,
    BackHandler,
} from 'react-native';

import {RNCamera} from 'react-native-camera';
import {AppContext} from '../../../Contexts.js';
import {Button} from 'react-native-elements';

/**
 * UI component for the camera, which is rendered when faculty wants to
 * take attendance in any course.
 * This component applies to the faculties.
 */
export default class Camera extends Component {

    /**
     * Getting the current nearest context to get the data from.
     * This context will have id and token of the faculty to authenticate him on the server
     * along with other useful information.
     */
    static contextType = AppContext;

    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
        };

        this.promises = [];

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        for (let prom of this.promises){
            // Cancel any pending promises on unmount.
            prom.cancel();
        }
    }

    /**
     * Handler which is called when the user hits back button on his/her device
     */
    handleBackButtonClick(){
        this.props.toggleCamera();
        return true;
    }

    render() {
        return (
            <View style={styles.container}>
            <RNCamera
                ref={ref => {
                  this.camera = ref;
                }}
                style={styles.preview}
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.on}
                androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
                }}
            />
            <View
                style={styles.capture}>
                <Button
                    title="Mark Attendence"
                    loading={this.state.isLoading}
                    disabled={this.state.isLoading}
                    onPress={this.props.takePicture.bind(this)}
                    style={styles.capture}
                />
            </View>
            <Button
                onPress={() => this.props.toggleCamera()}
                title="Close Camera"
                style={styles.capture}
            />
            </View>
        );
    }
}

let styles = {
    switchLoginMode: {
        fontSize: 16,
        color: 'blue',
        textAlign: 'right',
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
    },
    verticalRightLayout:{
        flexDirection: 'column',
    },
    capture: {
        flex: 0,
        backgroundColor: '#0f0',
        borderRadius: 5,
        padding: 0,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
      },
};
