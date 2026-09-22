import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  Switch,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, elevation, rounded, spacing } from '../../constants/theme';
import { studentProfile } from '../../data/profile';

export default function ProfileScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleOpenGithub = () => {
    Linking.openURL(`https://github.com/${studentProfile.github}`);
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />

      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable
            onPress={handleGoBack}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color={colors.onSurface} />
          </Pressable>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.headerRight}>
          <Image
            source={require('../../assets/lab1/me.jpeg')}
            style={styles.headerAvatar}
          />
          <Pressable
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Menu"
          >
            <Ionicons name="ellipsis-vertical" size={20} color={colors.onSurface} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroBackground}>
          <View style={styles.activeStudentBadge}>
            <View style={styles.activeDot} />
            <Text style={styles.activeBadgeText}>Active Student</Text>
          </View>
        </View>

        {/* Profile Card & Avatar */}
        <View style={styles.profileCard}>
          {/* Circular Avatar with 3px White Ring & Verified Badge */}
          <View style={styles.avatarWrapper}>
            <Image
              source={require('../../assets/lab1/me.jpeg')}
              style={styles.profileAvatar}
            />
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={14} color={colors.onPrimary} />
            </View>
          </View>

          {/* Student Info */}
          <Text style={styles.studentName}>{studentProfile.name}</Text>
          <View style={styles.branchRow}>
            <Ionicons name="school-outline" size={16} color={colors.secondary} />
            <Text style={styles.branchText}>{studentProfile.branch}</Text>
          </View>

          {/* ID & Year Badges */}
          <View style={styles.badgesRow}>
            <View style={styles.idBadge}>
              <Text style={styles.idBadgeText}>ID: {studentProfile.studentId}</Text>
            </View>
            <View style={styles.yearBadge}>
              <Text style={styles.yearBadgeText}>{studentProfile.yearSem}</Text>
            </View>
          </View>

          {/* GitHub Profile Card */}
          <View style={styles.githubCard}>
            <View style={styles.githubLeft}>
              <Image
                source={require('../../assets/lab1/github.png')}
                style={styles.githubIcon}
              />
              <View>
                <Text style={styles.githubLabel}>GITHUB PROFILE</Text>
                <Text style={styles.githubUsername}>@{studentProfile.github}</Text>
              </View>
            </View>
            <Pressable
              onPress={handleOpenGithub}
              style={({ pressed }) => [styles.githubButton, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Open GitHub Profile"
            >
              <Text style={styles.githubButtonText}>Open</Text>
              <Feather name="external-link" size={14} color={colors.onPrimary} />
            </Pressable>
          </View>
        </View>

        {/* Enrolled Subject Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="book-outline" size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>ENROLLED SUBJECT</Text>
            </View>
            <Text style={styles.activeCourseLabel}>Active Course</Text>
          </View>

          {studentProfile.subjects.map((subject) => (
            <View key={subject.code} style={styles.subjectCard}>
              <View style={styles.subjectCardHeader}>
                <View style={styles.subjectCodeBadge}>
                  <Text style={styles.subjectCodeText}>{subject.code}</Text>
                </View>
                <Text style={styles.creditsText}>{subject.credits.toFixed(1)} Credits</Text>
              </View>
              <Text style={styles.subjectName}>{subject.name}</Text>
              <Text style={styles.subjectDesc}>{subject.description}</Text>
            </View>
          ))}
        </View>

        {/* Interested In Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="grid-outline" size={18} color={colors.tertiary} />
              <Text style={styles.sectionTitle}>INTERESTED IN</Text>
            </View>
            <Text style={styles.topicsCount}>
              {studentProfile.interests.length} topics
            </Text>
          </View>

          <View style={styles.interestsCard}>
            <Text style={styles.interestsSubtitle}>
              Personal specializations, technical passions, and athletic recreation:
            </Text>
            <View style={styles.chipsContainer}>
              {studentProfile.interests.map((interest) => (
                <View key={interest.label} style={styles.chip}>
                  <Text style={styles.chipText}>
                    {interest.emoji} {interest.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Preferences & Records */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="options-outline" size={18} color={colors.onSurfaceVariant} />
              <Text style={styles.sectionTitle}>PREFERENCES & RECORDS</Text>
            </View>
          </View>

          <View style={styles.preferencesCard}>
            {/* Dark Mode Row */}
            <View style={styles.prefRow}>
              <View style={styles.prefLeft}>
                <View style={styles.prefIconContainer}>
                  <Ionicons name="moon-outline" size={20} color={colors.onSurface} />
                </View>
                <View>
                  <Text style={styles.prefTitle}>Dark Mode</Text>
                  <Text style={styles.prefSubtitle}>Adjust visual appearance</Text>
                </View>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={setIsDarkMode}
                trackColor={{ false: colors.surfaceContainerHigh, true: colors.primary }}
                thumbColor={colors.surfaceContainerLowest}
              />
            </View>

            <View style={styles.divider} />

            {/* Settings Row */}
            <Pressable
              style={({ pressed }) => [styles.prefRow, pressed && styles.pressed]}
              accessibilityRole="button"
            >
              <View style={styles.prefLeft}>
                <View style={styles.prefIconContainer}>
                  <Ionicons name="settings-outline" size={20} color={colors.onSurface} />
                </View>
                <View>
                  <Text style={styles.prefTitle}>Settings</Text>
                  <Text style={styles.prefSubtitle}>Notifications, security & privacy</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.outline} />
            </Pressable>
          </View>
        </View>

        {/* Log Out Button */}
        <Pressable
          style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}
          accessibilityRole="button"
        >
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>

        {/* Footer */}
        <Text style={styles.footerText}>
          Student Portal • Academic Year 2024–2025
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    height: 64,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.margin,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outlineVariant,
    ...elevation.card,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: rounded.full,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  heroBackground: {
    height: 110,
    backgroundColor: colors.secondaryContainer,
    alignItems: 'flex-end',
    paddingTop: spacing.md,
    paddingRight: spacing.margin,
  },
  activeStudentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: rounded.full,
    gap: 6,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryContainer,
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.onSurface,
  },
  profileCard: {
    backgroundColor: colors.surfaceContainerLowest,
    marginHorizontal: spacing.margin,
    marginTop: -50,
    borderRadius: rounded.lg,
    paddingHorizontal: spacing.margin,
    paddingBottom: spacing.lg,
    alignItems: 'center',
    ...elevation.card,
  },
  avatarWrapper: {
    marginTop: -45,
    position: 'relative',
  },
  profileAvatar: {
    width: 90,
    height: 90,
    borderRadius: rounded.full,
    borderWidth: 3,
    borderColor: colors.surfaceContainerLowest,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: rounded.full,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surfaceContainerLowest,
  },
  studentName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.onSurface,
    marginTop: spacing.sm,
  },
  branchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  branchText: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    fontWeight: '500',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  idBadge: {
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: rounded.full,
  },
  idBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
  },
  yearBadge: {
    backgroundColor: '#DCF2E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: rounded.full,
  },
  yearBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  githubCard: {
    width: '100%',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: rounded.DEFAULT,
    padding: spacing.md,
    marginTop: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  githubLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  githubIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  githubLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.outline,
    letterSpacing: 0.5,
  },
  githubUsername: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.onSurface,
    marginTop: 2,
  },
  githubButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: rounded.DEFAULT,
  },
  githubButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.margin,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.onSurfaceVariant,
    letterSpacing: 0.5,
  },
  activeCourseLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  topicsCount: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.outline,
  },
  subjectCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: rounded.lg,
    padding: spacing.md,
    ...elevation.card,
  },
  subjectCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  subjectCodeBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: rounded.full,
  },
  subjectCodeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.tertiary,
  },
  creditsText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.outline,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.onSurface,
    marginTop: 4,
  },
  subjectDesc: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
    marginTop: 4,
  },
  interestsCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: rounded.lg,
    padding: spacing.md,
    ...elevation.card,
  },
  interestsSubtitle: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: rounded.DEFAULT,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurface,
  },
  preferencesCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: rounded.lg,
    paddingHorizontal: spacing.md,
    ...elevation.card,
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  prefLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  prefIconContainer: {
    width: 36,
    height: 36,
    borderRadius: rounded.DEFAULT,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.onSurface,
  },
  prefSubtitle: {
    fontSize: 12,
    color: colors.outline,
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.outlineVariant,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceContainerLowest,
    marginHorizontal: spacing.margin,
    marginTop: spacing.lg,
    paddingVertical: 14,
    borderRadius: rounded.lg,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    ...elevation.card,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.error,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.outline,
    marginTop: spacing.md,
  },
});
