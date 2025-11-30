import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Avatar, IconButton, Button, Portal, Modal as PaperModal } from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

interface EditableAvatarProps {
    avatarUri: string | null;
    onAvatarChange: (uri: string | null) => void;
    size?: number;
}

const EditableAvatar: React.FC<EditableAvatarProps> = ({
    avatarUri,
    onAvatarChange,
    size = 100
}) => {
    const [showOptionsMenu, setShowOptionsMenu] = React.useState(false);
    const [showIconPicker, setShowIconPicker] = React.useState(false);

    // Available avatar icons (emojis and animals)
    const availableIcons = [
        '😀', '😃', '😄', '😁', '😊', '🙂', '😇', '🥰', '😍', '🤩',
        '😎', '🤓', '🧐', '🤠', '👨', '👩', '👴', '👵', '👶', '🧒',
        '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
        '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆',
        '🦉', '🦅', '🦋', '🐝', '🐞', '🦄', '🐴', '🦓', '🦒', '🐘',
    ];

    const handleTakePhoto = async () => {
        setShowOptionsMenu(false);
        // Small delay to ensure modal closes before opening camera
        setTimeout(async () => {
            const result = await launchCamera({
                mediaType: 'photo',
                quality: 0.8,
            });
            if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
                onAvatarChange(result.assets[0].uri);
            }
        }, 300);
    };

    const handleSelectFromGallery = async () => {
        setShowOptionsMenu(false);
        // Small delay to ensure modal closes before opening image picker
        setTimeout(async () => {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 0.8,
            });
            if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
                onAvatarChange(result.assets[0].uri);
            }
        }, 300);
    };

    const handleSelectIcon = (icon: string) => {
        onAvatarChange(`icon:${icon}`);
        setShowIconPicker(false);
        setShowOptionsMenu(false);
    };

    const handleOpenIconPicker = () => {
        setShowOptionsMenu(false);
        setShowIconPicker(true);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => setShowOptionsMenu(true)}
                style={styles.avatarTouchable}
                activeOpacity={0.8}
            >
                <View style={[styles.avatarWrapper, { width: size, height: size }]}>
                    {avatarUri ? (
                        avatarUri.startsWith('icon:') ? (
                            <View style={[styles.iconAvatar, { width: size, height: size, borderRadius: size / 2 }]}>
                                <Text style={[styles.iconAvatarText, { fontSize: size * 0.6 }]}>
                                    {avatarUri.replace('icon:', '')}
                                </Text>
                            </View>
                        ) : (
                            <Avatar.Image size={size} source={{ uri: avatarUri }} />
                        )
                    ) : (
                        <Avatar.Icon size={size} icon="face-man" />
                    )}

                    {/* Edit overlay indicator */}
                    <View style={styles.editOverlay}>
                        <IconButton
                            icon="pencil"
                            size={20}
                            iconColor="white"
                            style={styles.editIcon}
                        />
                    </View>
                </View>
            </TouchableOpacity>

            {/* Options Bottom Sheet */}
            <Modal
                visible={showOptionsMenu}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowOptionsMenu(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowOptionsMenu(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <View style={styles.bottomSheet}>
                            <View style={styles.sheetHandle} />
                            <Text style={styles.sheetTitle}>Choose Avatar Source</Text>

                            <TouchableOpacity
                                style={styles.optionButton}
                                onPress={handleTakePhoto}
                            >
                                <IconButton icon="camera" size={24} />
                                <View style={styles.optionTextContainer}>
                                    <Text style={styles.optionTitle}>Take Photo</Text>
                                    <Text style={styles.optionSubtitle}>Use your camera</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.optionButton}
                                onPress={handleSelectFromGallery}
                            >
                                <IconButton icon="image" size={24} />
                                <View style={styles.optionTextContainer}>
                                    <Text style={styles.optionTitle}>Choose from Gallery</Text>
                                    <Text style={styles.optionSubtitle}>Select an existing photo</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.optionButton}
                                onPress={handleOpenIconPicker}
                            >
                                <IconButton icon="emoticon-happy-outline" size={24} />
                                <View style={styles.optionTextContainer}>
                                    <Text style={styles.optionTitle}>Pick an Icon</Text>
                                    <Text style={styles.optionSubtitle}>Choose from emojis & animals</Text>
                                </View>
                            </TouchableOpacity>

                            <Button
                                mode="text"
                                onPress={() => setShowOptionsMenu(false)}
                                style={styles.cancelButton}
                            >
                                Cancel
                            </Button>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* Icon Picker Modal */}
            <Modal
                visible={showIconPicker}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowIconPicker(false)}
            >
                <View style={styles.iconPickerContainer}>
                    <View style={styles.iconPickerContent}>
                        <View style={styles.iconPickerHeader}>
                            <Text style={styles.iconPickerTitle}>Select Avatar Icon</Text>
                            <IconButton icon="close" onPress={() => setShowIconPicker(false)} />
                        </View>
                        <ScrollView contentContainerStyle={styles.iconGrid}>
                            {availableIcons.map((icon, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.iconOption}
                                    onPress={() => handleSelectIcon(icon)}
                                >
                                    <Text style={styles.iconOptionText}>{icon}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarTouchable: {
        position: 'relative',
    },
    avatarWrapper: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editOverlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#2196F3',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'white',
    },
    editIcon: {
        margin: 0,
    },
    iconAvatar: {
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconAvatarText: {
        fontSize: 60,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 40,
        paddingTop: 8,
    },
    sheetHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#DDD',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
    },
    sheetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    optionTextContainer: {
        flex: 1,
        marginLeft: 8,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    optionSubtitle: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    cancelButton: {
        marginTop: 8,
    },
    iconPickerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    iconPickerContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        width: '90%',
        maxHeight: '80%',
        overflow: 'hidden',
    },
    iconPickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    iconPickerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    iconGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
        gap: 8,
    },
    iconOption: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
    },
    iconOptionText: {
        fontSize: 32,
    },
});

export default EditableAvatar;
